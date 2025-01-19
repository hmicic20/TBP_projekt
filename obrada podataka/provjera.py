import pandas as pd

# Učitavanje CSV datoteke
df = pd.read_csv('Cleaned_Indian_Food_Dataset.csv')

# 1. Izvlačenje jedinstvenih sastojaka
all_ingredients = set()
for ingredients in df['Cleaned-Ingredients']:
    ingredient_list = [ing.strip().lower() for ing in ingredients.split(',')]
    all_ingredients.update(ingredient_list)

# Spremanje jedinstvenih sastojaka u novi CSV
ingredients_df = pd.DataFrame({'Ingredient': list(all_ingredients)})
ingredients_df.to_csv('unique_ingredients.csv', index=False)

# 2. Generiranje relacija recept-sastojak
relations = []
for index, row in df.iterrows():
    recipe_name = row['TranslatedRecipeName']
    ingredient_list = [ing.strip().lower() for ing in row['Cleaned-Ingredients'].split(',')]
    for ingredient in ingredient_list:
        relations.append({'Recipe': recipe_name, 'Ingredient': ingredient})

# Spremanje relacija u novi CSV
relations_df = pd.DataFrame(relations)
relations_df.to_csv('recipe_ingredient_relations.csv', index=False)

print("CSV datoteke su uspješno kreirane.")
