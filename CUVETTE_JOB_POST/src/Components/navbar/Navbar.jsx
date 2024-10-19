import React from "react";
import Button from "../Button";
import "./Navbar.css"

function Navbar() {
  return (
    <nav>
      <div className="navbar">
        <div>
          <img src="src/assets/logo.png" />
        </div>
        <div>
          <Button className="nav-contact-btn">Contact</Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
