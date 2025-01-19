import axios from 'axios';

// Kreiramo instancu axiosa s baznim URL-om
const API = axios.create({
  baseURL: 'http://127.0.0.1:5000',
});

// Funkcija za dohvaćanje popisa svih recepata
export const getAllRecipes = async () => {
  try {
    const response = await API.get('/recipes');
    return response.data;
  } catch (error) {
    console.error('Error fetching all recipes:', error);
    throw error;
  }
};

// Funkcija za dohvaćanje detalja pojedinog recepta prema recipe_id
export const getRecipeDetails = async (recipe_id) => {
  try {
    const response = await API.get(`/recipe/${recipe_id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching recipe details for ID ${recipe_id}:`, error);
    throw error;
  }
};

// Eksport svih funkcija
export default API;


