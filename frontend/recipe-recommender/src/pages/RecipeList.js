import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Koristi za navigaciju
import axios from 'axios';
import './RecipeList.css';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 24;

  useEffect(() => {
    axios
      .get('http://127.0.0.1:5000/recipes')
      .then((response) => {
        setRecipes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error);
      });
  }, []);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(recipes.length / recipesPerPage);
  const maxPageButtons = 5;

  const getPaginationRange = () => {
    const range = [];
    const start = Math.max(2, currentPage - Math.floor(maxPageButtons / 2));
    const end = Math.min(totalPages - 1, currentPage + Math.floor(maxPageButtons / 2));

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  return (
    <div className="recipe-container">
      <div className="recipe-grid">
        {currentRecipes.map((recipe, index) => (
          <Link
            to={`/recipe/${recipe.recipe_id}`}
            key={index}
            className="recipe-card"
          >
            <figure>
              <img
                src={recipe.image || 'https://via.placeholder.com/150'}
                alt={recipe.name}
                className="recipe-image"
              />
              <figcaption className="recipe-title">{recipe.name}</figcaption>
            </figure>
          </Link>
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &laquo;
        </button>
        <button onClick={() => paginate(1)} className={currentPage === 1 ? 'active' : ''}>
          1
        </button>
        {currentPage > maxPageButtons && <span>...</span>}
        {getPaginationRange().map((page) => (
          <button
            key={page}
            onClick={() => paginate(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}
        {currentPage < totalPages - maxPageButtons && <span>...</span>}
        <button
          onClick={() => paginate(totalPages)}
          className={currentPage === totalPages ? 'active' : ''}
        >
          {totalPages}
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
};

export default RecipeList;
