import React from "react";
import { Link } from "react-router-dom";
import PersonalizedIcon from '../pictures/channels4_profile.jpg';
import FastIcon from '../pictures/netflix-fast-com.webp';
import CommunityIcon from '../pictures/1_M-b093jQIpmapIIaxH7N7g.jpg';
import "./Home.css"; // Dodajemo CSS za stilizaciju

const Home = () => {
  return (
    <div className="home-container text-center">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to Recipe Recommender</h1>
        <p className="hero-subtitle">Discover the best recipes tailored just for you!</p>
        <Link to="/recommendations" className="btn btn-primary btn-lg mt-3">
          Get Recommendations
        </Link>
      </div>

      <div className="features-section mt-5">
        <h2 className="features-title">Why Choose Us?</h2>
        <div className="features-grid">
            <div className="feature-card">
                <img src={PersonalizedIcon} alt="Personalized" className="feature-icon" />
                <h3>Personalized Recommendations</h3>
                <p>Get recipes based on your unique preferences and tastes.</p>
            </div>
            <div className="feature-card">
                <img src={FastIcon} alt="Fast" className="feature-icon" />
                <h3>Quick and Easy</h3>
                <p>Find recipes in seconds and start cooking right away!</p>
            </div>
            <div className="feature-card">
                <img src={CommunityIcon} alt="Community" className="feature-icon" />
                <h3>Community Driven</h3>
                <p>See what recipes are loved by others like you.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

