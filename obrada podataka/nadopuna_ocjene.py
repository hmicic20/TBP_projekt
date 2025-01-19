import pandas as pd
import random

# Učitavanje postojećih podataka
rating_data = pd.read_csv("user_recipe_ratings.csv")
recipes_data = pd.read_csv("Cleaned_Indian_Food_Dataset.csv")

# Dodavanje popularnih recepata
user_ids = rating_data["userID"].unique()
popular_recipes = recipes_data["TranslatedRecipeName"].value_counts().index[:20]

new_rows = []
for recipe in popular_recipes:
    for _ in range(10):  # 10 novih ocjena po receptu
        user = random.choice(user_ids)
        ocjena = random.randint(1, 5)
        new_rows.append({"userID": user, "recipe": recipe, "rating": ocjena})

# Kombiniranje novih redova s postojećim podacima
new_data = pd.DataFrame(new_rows)
rating_data = pd.concat([rating_data, new_data], ignore_index=True)

# Spremanje novog CSV-a
rating_data.to_csv("user_recipe_ratings_extended.csv", index=False)
print("Prošireni CSV datoteka 'user_recipe_ratings_extended.csv' kreirana.")

