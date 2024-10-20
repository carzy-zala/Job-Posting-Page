import React from "react";
import "./Loader.css";

function Loader({ backgroundColor = "" }) {
  return (
    <div
      style={{
        background: backgroundColor,
        margin:"0 auto"
      }}
      className="loader"
    ></div>
  );
}

export default Loader;
