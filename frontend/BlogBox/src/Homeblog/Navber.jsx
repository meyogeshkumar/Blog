import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Allstyles.css";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigator = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigator("/Login");
  };

  return (
    <nav className="navbar navbar-expand custom-navbar">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          MyBlog
        </Link>

        <ul className="navbar-nav ms-auto">
          {!isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/Login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/Signup">
                  Sign-Up
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item me-3">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    navigator("/Add-blog");
                  }}>
                  View
                </button>
              </li>
              <li className="nav-item">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};
