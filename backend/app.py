from flask import Flask, request, jsonify
from neo4j import GraphDatabase
from flask_cors import CORS
from urllib.parse import unquote

app = Flask(__name__)
CORS(app)  # Omogućuje CORS za React frontend

# Spajanje na Neo4j bazu
uri = "neo4j+s://bccb88b9.databases.neo4j.io"  # Zamijenite sa svojom Neo4j adresom (za AuraDB koristite uri)
username = "neo4j"
password = "YV6ujbfiV50gn_MFogykhuEvDEFur6ngr8lxy96bDUo"


driver = GraphDatabase.driver(uri, auth=(username, password))

# Ruta za dohvaćanje svih recepata
@app.route('/recipes', methods=['GET'])
def get_recipes():
    query = "MATCH (r:Recept) RETURN r.Naziv AS name, r.Instrukcije AS instructions, r.URL_slike AS image"
    with driver.session() as session:
        result = session.run(query)
        recipes = [{"name": record["name"], "instructions": record["instructions"], "image": record["image"]} for record in result]
    return jsonify(recipes)

# Ruta za preporuke na temelju recepta
@app.route('/recommendations', methods=['GET'])
def get_recommendations():
    recipe_name = request.args.get('recipe')
    if not recipe_name:
        return jsonify({"error": "Missing recipe parameter"}), 400

    query = """
    MATCH (r1:Recipe {name: $recipe_name})-[:HAS_INGREDIENT]->(i:Ingredient)<-[:HAS_INGREDIENT]-(r2:Recipe)
    WHERE r1 <> r2
    RETURN r2.name AS recommended_recipe, COUNT(i) AS common_ingredients
    ORDER BY common_ingredients DESC LIMIT 5
    """
    with driver.session() as session:
        result = session.run(query, recipe_name=recipe_name)
        recommendations = [{"name": record["recommended_recipe"], "common_ingredients": record["common_ingredients"]} for record in result]
    return jsonify(recommendations)

# Ruta za dohvaćanje detalja recepta
@app.route('/recipe/<int:recipe_id>', methods=['GET'])
def get_recipe_details(recipe_id):
    query = """
    MATCH (r:Recept)
    WHERE r.recipe_id = $recipe_id
    RETURN r.Naziv AS naziv, r.Instrukcije AS instrukcije, 
           r.Vrijeme AS vrijeme, r.URL_slike AS slika, 
           r.Podrijetlo AS podrijetlo
    """
    with driver.session() as session:
        result = session.run(query, recipe_id=recipe_id)
        record = result.single()

        if record:
            print("Naziv iz baze za query:", record["naziv"])  # Debug
            sastojci_query = """
            MATCH (r:Recept {Naziv: $naziv})-[:SADRZI]->(s:Sastojak)
            RETURN collect(s.Naziv) AS sastojci
            """
            sastojci_result = session.run(sastojci_query, naziv=record["naziv"])
            sastojci_record = sastojci_result.single()

            print("sastojci_result raw data:", list(sastojci_result))  # Debug
            print("sastojci_record data:", sastojci_record)  # Debug

            return jsonify({
                "recipe_id": recipe_id,
                "naziv": record["naziv"],
                "instrukcije": record["instrukcije"],
                "vrijeme": record["vrijeme"],
                "slika": record["slika"],
                "podrijetlo": record["podrijetlo"],
                "sastojci": sastojci_record["sastojci"] if sastojci_record else []
            })
        else:
            print("No matching recipe found in database.")
            return jsonify({"error": "Recipe not found"}), 404

@app.route('/recommend/ingredients', methods=['POST'])
def recommend_by_ingredients():
    ingredients = request.json.get('ingredients', [])
    if not ingredients:
        return jsonify({"message": "No ingredients provided"}), 400

    query = """
    MATCH (r:Recept)-[:HAS_INGREDIENT]->(i:Sastojak)
    WHERE i.Naziv IN $ingredients
    RETURN DISTINCT r.Naziv AS Recipe, r.URL_slike AS Image, r.Vrijeme AS Time, r.Podrijetlo AS Origin
    LIMIT 10
    """
    with driver.session() as session:
        results = session.run(query, ingredients=ingredients)
        recommendations = [record.data() for record in results]

    return jsonify(recommendations)

# Preporuka na temelju vremena pripreme
@app.route('/recommend/time', methods=['POST'])
def recommend_by_time():
    max_time = request.json.get('time', 0)
    if max_time <= 0:
        return jsonify({"message": "Invalid time value"}), 400

    query = """
    MATCH (r:Recept)
    WHERE toInteger(r.Vrijeme) <= $max_time
    RETURN r.Naziv AS Recipe, r.URL_slike AS Image, r.Vrijeme AS Time, r.Podrijetlo AS Origin
    LIMIT 10
    """
    with driver.session() as session:
        results = session.run(query, max_time=max_time)
        recommendations = [record.data() for record in results]

    return jsonify(recommendations)

# Preporuka na temelju podrijetla jela
@app.route('/recommend/origin', methods=['POST'])
def recommend_by_origin():
    origin = request.json.get('origin', '')
    if not origin:
        return jsonify({"message": "No origin provided"}), 400

    query = """
    MATCH (r:Recept)
    WHERE r.Podrijetlo = $origin
    RETURN r.Naziv AS Recipe, r.URL_slike AS Image, r.Vrijeme AS Time, r.Podrijetlo AS Origin
    LIMIT 10
    """
    with driver.session() as session:
        results = session.run(query, origin=origin)
        recommendations = [record.data() for record in results]

    return jsonify(recommendations)

def get_recommendations_for_user(user_name):
    query = """
    MATCH (user:Korisnik)-[:OCJENA]->(r:Recept)
    WHERE user.Ime = $user_name

    MATCH (r)<-[:OCJENA]-(similar_user:Korisnik)-[:OCJENA]->(recommended:Recept)
    WHERE NOT (user)-[:OCJENA]->(recommended)
      AND similar_user <> user

    RETURN recommended.Naziv AS recipe, COUNT(similar_user) AS shared_users, AVG(r.ocjena) AS avg_rating
    ORDER BY avg_rating DESC, shared_users DESC
    LIMIT 5
    """
    with driver.session() as session:
        results = session.run(query, user_name=user_name)
        recommendations = [{"recipe": record["recipe"],
                            "shared_users": record["shared_users"],
                            "avg_rating": record["avg_rating"]} for record in results]
        return recommendations

@app.route('/recommend/user', methods=['GET'])
def recommend_user():
    user_name = request.args.get('user_name')
    if not user_name:
        return jsonify({"error": "user_name parameter is required"}), 400

    query = """
    MATCH (k:Korisnik {Ime: $user_name})-[:OCJENA]->(r:Recept)<-[:OCJENA]-(slicni:Korisnik)
    WITH k, slicni, r
    MATCH (slicni)-[o:OCJENA]->(rec:Recept)
    WHERE NOT (k)-[:OCJENA]->(rec)
    WITH rec, avg(o.ocjena) AS avg_rating, count(DISTINCT slicni) AS shared_users
    MATCH (rec)-[:SADRZI]->(s:Sastojak)
    RETURN rec.Naziv AS recipe, 
           rec.URL_slike AS image, 
           avg_rating, 
           shared_users, 
           collect(s.Naziv) AS ingredients
    ORDER BY avg_rating DESC, shared_users DESC
    LIMIT 10;
    """

    try:
        with driver.session() as session:
            results = session.run(query, user_name=user_name)
            recommendations = [
                {
                    "recipe": record["recipe"],
                    "image": record["image"],
                    "avg_rating": record["avg_rating"],
                    "shared_users": record["shared_users"],
                    "ingredients": record["ingredients"]
                }
                for record in results
            ]
        return jsonify(recommendations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/recommend/similar', methods=['GET'])
def recommend_similar():
    user_name = request.args.get('user_name')
    if not user_name:
        return jsonify({"error": "user_name parameter is required"}), 400

    query = """
    MATCH (k:Korisnik {Ime: $user_name})-[:OCJENA]->(user_rec:Recept)-[:SADRZI]->(user_ingredient:Sastojak)
    WITH k, collect(DISTINCT user_ingredient.Naziv) AS user_ingredients
    MATCH (rec:Recept)-[:SADRZI]->(ingredient:Sastojak)
    WHERE NOT (k)-[:OCJENA]->(rec) // Izbjegavaj recepte koje je korisnik već ocijenio
    WITH rec, 
         collect(DISTINCT ingredient.Naziv) AS recipe_ingredients, 
         user_ingredients
    WITH rec, 
         recipe_ingredients, 
         user_ingredients,
         size([ingredient IN recipe_ingredients WHERE ingredient IN user_ingredients]) AS matched_ingredients_count,
         size(user_ingredients) AS total_user_ingredients
    MATCH (rec)<-[o:OCJENA]-(:Korisnik)
    RETURN rec.Naziv AS recipe, 
           rec.URL_slike AS image, 
           recipe_ingredients AS matched_ingredients,
           avg(o.ocjena) AS avg_rating,
           count(o) AS num_ratings,
           toFloat(matched_ingredients_count) / total_user_ingredients AS similarity_score
    ORDER BY similarity_score DESC, avg_rating DESC, num_ratings DESC
    LIMIT 10
    """

    try:
        with driver.session() as session:
            results = session.run(query, user_name=user_name)
            recommendations = [
                {
                    "recipe": record["recipe"],
                    "image": record["image"],
                    "matched_ingredients": record["matched_ingredients"],
                    "avg_rating": record["avg_rating"],
                    "num_ratings": record["num_ratings"],
                    "similarity_score": record["similarity_score"],
                }
                for record in results
            ]
        return jsonify(recommendations), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
