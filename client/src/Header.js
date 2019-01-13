import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="header">
      <div className="icons">
        <a href="https://github.com/zurda">
          <i className="fab fa-github fa-3x" />
        </a>
        <a href="https://twitter.com/zurdev">
          <i className="fab fa-twitter fa-3x" />
        </a>
        <a href="https://www.linkedin.com/in/zurda/">
          <i className="fab fa-linkedin fa-3x" />
        </a>
        <Link to="/">
          <button>home</button>
        </Link>
        <Link to="/add-post">
          <button>Add a post</button>
        </Link>
        <Link to="/login">
          <button>Log in</button>
        </Link>
        <Link to="/signup">
          <button>Signup</button>
        </Link>
      </div>
      <h1>Coding Logbook</h1>
      <h3>Never loose a reference!</h3>
    </div>
  );
};

export default Header;
