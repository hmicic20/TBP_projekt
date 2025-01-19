// src/components/RecipeDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeDetails } from '../services/api';
import { Container, Image } from 'react-bootstrap';

const RecipeDetails = () => {
  const { title } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await getRecipeDetails(title);
        setRecipe(data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
      }
    };
    fetchRecipe();
  }, [title]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <Container>
      <h1 className="my-4">{recipe.Naziv}</h1>
      <Image src={recipe.URL_slike} fluid />
      <h3 className="mt-4">Instructions</h3>
      <p>{recipe.Instrukcije}</p>
      <h4>Origin</h4>
      <p>{recipe.Podrijetlo}</p>
      <h4>Preparation Time</h4>
      <p>{recipe.Vrijeme} minutes</p>
    </Container>
  );
};

export default RecipeDetails;
