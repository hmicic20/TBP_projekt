import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css"; // Dodana stilizacija za dinamični footer

const Footer = () => {
  return (
    <footer className="custom-footer">
      <Container>
        <Row>
          {/* Navigacijski linkovi */}
          <Col md={4} className="footer-section">
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/recommendations">Recommendations</a>
              </li>
            </ul>
          </Col>

          {/* Informacije o stranici */}
          <Col md={4} className="footer-section">
            <h5>About Us</h5>
            <p>
              Recipe Recommender helps you discover and enjoy recipes tailored
              to your taste. Find your next favorite dish!
            </p>
          </Col>

          {/* Društvene mreže */}
          <Col md={4} className="footer-section">
            <h5>Follow Us</h5>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noreferrer">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="text-center">
            <p>© 2025 Recipe Recommender. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
