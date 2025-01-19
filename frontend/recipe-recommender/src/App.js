import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeList from './pages/RecipeList';
import Recommendation from './pages/Recommendation';
import RecipeDetails from './pages/RecipeDetails';
import Home from './pages/Home'; // Uključujemo Home
import About from './pages/About'; // Uključujemo About
import Contact from './pages/Contact'; // Uključujemo Contact
import Header from './components/Header';
import Footer from './components/Footer';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/recommendations" element={<Recommendation />} />
        <Route path="/recipes" element={<RecipeList />} /> {/* Dodan RecipeList */}
        <Route path="/recipe/:id" element={<RecipeDetails />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;


