import React, { Fragment, useEffect, useState } from "react";
import Button from "../Button";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { apiRoutes } from "../../services/apiRoutes";
import { axiosGet } from "../../services/axios.config";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../Feature/adminSlice.js";
import setToken from "../../utils/setToken.js";
import Loader from "../Loader/Loader.jsx";
import { toast } from "react-toastify";

function Navbar() {
  const isAuthenticated = useSelector((store) => store.admin.isAuthenticated);
  const dispatch = useDispatch();

  const navigator = useNavigate();
  const [dropDownClick, setDropDownClick] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (!isLoading) {
      setIsLoading(true);
      const responseData = await axiosGet(
        `${import.meta.env.VITE_CUVETTE_JOB_POST_API_URL}${apiRoutes.LOGOUT}`
      );

      if (responseData.success) {
        setDropDownClick(false);
        dispatch(logout());
        setToken();
        navigator("/");
      } else {
        toast.error(responseData.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      {!isAuthenticated && (
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
      )}
      {isAuthenticated && (
        <nav className="auth-nav">
          <div className="auth-navbar">
            <div>
              <img src="assets/logo.png" />
            </div>
            <div className="auth-nav-right-side-div">
              <div>
                <Button className="nav-contact-btn">Contact</Button>
              </div>
              <div className="auth-nav-dropdown-btn-div">
                <Button
                  className="nav-dropdown-btn"
                  onClick={() => setDropDownClick(!dropDownClick)}
                >
                  <div className="nav-dropdown-side">
                    <div
                      style={{
                        height: "2.5rem",
                        width: "2.5rem",
                        backgroundColor: "#cccccc",
                        borderRadius: "50%",
                      }}
                    ></div>
                    Your Name
                  </div>
                  {dropDownClick ? (
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      size="2xl"
                      style={{ paddingBottom: "0.5rem" }}
                      rotation={180}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      size="2xl"
                      style={{ paddingBottom: "0.5rem" }}
                    />
                  )}
                </Button>
              </div>
              {dropDownClick && (
                <div className="dropdown-div">
                  <Button
                    children={
                      isLoading ? <Loader backgroundColor="white" /> : "Logout"
                    }
                    className="logout-btn"
                    onClick={handleLogout}
                  />
                </div>
              )}
            </div>
          </div>
        </nav>
      )}
    </Fragment>
  );
}

export default Navbar;
