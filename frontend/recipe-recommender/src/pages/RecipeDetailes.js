import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RecipeDetails = () => {
  const { id } = useParams(); // Dohvaća recipe_id iz URL-a
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/recipe/${id}`);
        setRecipeDetails(response.data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setErrorMessage('Error fetching recipe details. Please try again later.');
      }
    };

    if (id) {
      fetchRecipeDetails();
    } else {
      setErrorMessage('Invalid recipe ID.');
    }
  }, [id]);

  if (errorMessage) {
    return (
      <>
        <Header />
        <div className="text-center mt-5">
          <p className="text-danger">{errorMessage}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!recipeDetails) {
    return (
      <>
        <Header />
        <div className="text-center mt-5">
          <p>Loading recipe details...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container my-5">
        <h1>{recipeDetails.naziv}</h1>
        <img
          src={recipeDetails.slika || 'https://via.placeholder.com/150'}
          alt={recipeDetails.naziv}
          className="img-fluid mb-4"
        />
        <p><strong>Origin:</strong> {recipeDetails.podrijetlo || 'Unknown'}</p>
        <p><strong>Preparation Time:</strong> {recipeDetails.vrijeme} minutes</p>
        <h5>Ingredients:</h5>
        <ul>
          {recipeDetails.sastojci.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
        <h5>Instructions:</h5>
        <p>{recipeDetails.instrukcije}</p>
      </div>
      <Footer />
    </>
  );
};

export default RecipeDetails;