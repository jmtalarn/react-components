import React from "react";
import { Link } from "react-router-dom";

export default () => (
  <nav>
    <ul style={{ listStyle: "none", display: "flex", flexDirection: "row" }}>
      <li style={{ marginRight: "1rem" }}>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/stepform">Stepform</Link>
      </li>
    </ul>
  </nav>
);
