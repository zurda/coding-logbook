import React from "react";
import "./Header.css";

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
      </div>
      <h1>Coding Logbook</h1>
      <h3>Never loose a reference!</h3>
    </div>
  );
};

export default Header;
