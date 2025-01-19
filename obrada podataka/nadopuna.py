import pandas as pd
import random

# Učitavanje CSV datoteka
rating_data = pd.read_csv("rating_final.csv")
userprofile_data = pd.read_csv("userprofile.csv")
recipes_data = pd.read_csv("Cleaned_Indian_Food_Dataset.csv")

# Učitajte imena iz tekstualne datoteke
with open('Imena.txt', 'r', encoding='utf-8') as file:
    names = file.read().splitlines()

# Dodavanje nasumičnih imena korisnicima
user_ids = userprofile_data["userID"].tolist()
random_names = random.sample(names, len(user_ids))
userprofile_data["Name"] = random_names

# Spremanje proširenih podataka korisnika u novi CSV
userprofile_data[["userID", "Name", "birth_year", "marital_status", "hijos", "weight", "height"]].to_csv(
    "user_profiles_with_names.csv", index=False
)

# Generiranje slučajnih veza između korisnika i recepata
recipes_list = recipes_data["TranslatedRecipeName"].tolist()
rating_data["recipe"] = [random.choice(recipes_list) for _ in range(len(rating_data))]

# Spremanje ocjena s vezama na recepte u novi CSV
rating_data[["userID", "recipe", "rating"]].to_csv("user_recipe_ratings.csv", index=False)

# Prikaz informacija
print("Korisnički podaci s imenima spremljeni u 'user_profiles_with_names.csv'")
print("Ocjene recepata spremljene u 'user_recipe_ratings.csv'")
