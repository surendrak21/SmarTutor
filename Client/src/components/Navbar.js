// Client/src/components/Navbar.js
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { UserContext } from "../App";
import "bootstrap/dist/css/bootstrap.css";
import "./Navbar.css"; // <-- add this import

const Navbar = () => {
  const { state } = useContext(UserContext);

  // react-router v6 way to style active vs normal
  const linkClass = ({ isActive }) =>
    "nav-link-item" + (isActive ? " active-link" : "");

  return (
    <header className="app-navbar-wrapper">
      <nav className="navbar navbar-expand-lg custom-navbar">
        {/* Brand / Logo */}
        <NavLink className="navbar-brand app-brand" to="/">
          <span className="brand-main">SmartTutor</span>
          <span className="brand-badge">beta</span>
        </NavLink>

       
        <button
          className="navbar-toggler custom-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon custom-toggler-icon" />
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav nav-links-list">
            {/* Always visible nav links */}
            <li className="nav-item">
              <NavLink className={linkClass} to="/">
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={linkClass} to="/preregistration">
                PreRegistration
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={linkClass} to="/courseclash">
                CourseClash
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={linkClass} to="/courses">
                Courses
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className={linkClass} to="/announcement">
                Announcement
              </NavLink>
            </li>

            {/* Auth section */}
            {state ? (
              <>
                {/* logged IN */}
                <li className="nav-item">
                  <NavLink className={linkClass} to="/logout">
                    Logout
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                {/* logged OUT */}
                <li className="nav-item">
                  <NavLink className={linkClass} to="/login">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className={linkClass} to="/signup">
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
