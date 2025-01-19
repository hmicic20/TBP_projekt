import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';

const Recommendation = () => {
  const [userName, setUserName] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRecommend = async (recommendationType) => {
    try {
      setErrorMessage('');
      if (!userName.trim()) {
        setErrorMessage('Please enter a valid name.');
        return;
      }

      const endpoint =
        recommendationType === 'similar'
          ? `http://127.0.0.1:5000/recommend/similar?user_name=${userName.trim()}`
          : `http://127.0.0.1:5000/recommend/user?user_name=${userName.trim()}`;

      const response = await axios.get(endpoint);

      if (response.data && response.data.length > 0) {
        setRecommendations(response.data);
      } else {
        setRecommendations([]);
        setErrorMessage('No recommendations found for this user.');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setErrorMessage('An error occurred while fetching recommendations. Please check your backend.');
    }
  };

  return (
    <>
      <Container>
        <h1 className="my-4 text-center">Personalized Recipe Recommendations</h1>
        <Form className="mb-4">
          <Form.Group controlId="userName">
            <Form.Label>Enter your name</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., Anna"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex justify-content-around mt-3">
            <Button variant="primary" onClick={() => handleRecommend('default')}>
              Recommendations by Ratings
            </Button>
            <Button variant="secondary" onClick={() => handleRecommend('similar')}>
              Recommendations by Ingredients
            </Button>
          </div>
        </Form>

        {errorMessage && (
          <p className="text-danger text-center">{errorMessage}</p>
        )}

        <Row className="mt-4">
          {recommendations.map((recipe, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card>
                <Card.Img
                  variant="top"
                  src={recipe.image || 'https://via.placeholder.com/150'}
                  alt={recipe.recipe}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{recipe.recipe}</Card.Title>
                  <Card.Text>
                    Average Rating: {recipe.avg_rating ? recipe.avg_rating.toFixed(2) : 'No ratings yet'}
                  </Card.Text>
                  <Card.Text>Shared Users: {recipe.shared_users}</Card.Text>
                  <Card.Text>
                    Ingredients: {
                      recipe.ingredients && recipe.ingredients.length > 0
                        ? recipe.ingredients.slice(0, 3).join(', ') + (recipe.ingredients.length > 3 ? '...' : '')
                        : 'No ingredients available'
                    }
                  </Card.Text>
                  {recipe.similarity_score && (
                    <Card.Text>
                      Similarity Score: {recipe.similarity_score.toFixed(2)}
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default Recommendation;


