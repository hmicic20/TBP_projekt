import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import "./Header.css"; // Stilizacija za dinamičan header

const Header = () => {
  return (
    <Navbar expand="lg" className="custom-navbar">
      <Navbar.Brand as={NavLink} to="/" className="brand-logo">
        Recipe Recommender
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          <Nav.Link
            as={NavLink}
            to="/"
            className="nav-item"
            activeClassName="active-link"
            exact
          >
            Home
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/about"
            className="nav-item"
            activeClassName="active-link"
          >
            About
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/contact"
            className="nav-item"
            activeClassName="active-link"
          >
            Contact
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/recommendations"
            className="nav-item"
            activeClassName="active-link"
          >
            Recommendations
          </Nav.Link>
          <Nav.Link
            as={NavLink}
            to="/recipes"
            className="nav-item"
            activeClassName="active-link"
          >
            Recipe List
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;