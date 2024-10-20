import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Button from "../Button";
import { useNavigate } from "react-router-dom";

function Sidebar({handleHome}) {
  const navigator = useNavigate();

  return (
    <div className="sidebar">
      <Button
        style={{
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
        }}
        onClick={() => {
          handleHome(false)
        }}
      >
        <FontAwesomeIcon icon={faHouse} size="2xl" />
      </Button>
    </div>
  );
}

export default Sidebar;
