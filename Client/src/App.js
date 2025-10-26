// Client/src/App.js
import React, { createContext, useReducer } from "react";
import { Route, Routes } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "./style.css";
import InfoTicker from "./components/MarqueeBar";

import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import PreRegistration from "./components/PreReg/PreReg";
import CourseClash from "./components/CourseClash/CourseClash";
import Courses from "./components/Courses/Courses";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Announcement from "./components/Announcement/Announcement";
import Admin from "./components/Admin";
import Page from "./components/Courses/Courses_page/Page";
import Logout from "./components/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import { initialState, reducer } from "./reducer/UseReducer";

export const UserContext = createContext();

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <Navbar />

        <Routes>
          {/* PRIVATE ROUTES */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/preregistration"
            element={
              <ProtectedRoute>
                <PreRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courseclash"
            element={
              <ProtectedRoute>
                <CourseClash />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcement"
            element={
              <ProtectedRoute>
                <Announcement />
              </ProtectedRoute>
            }
          />

          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/page" element={<Page />} />
        </Routes>
               
        <InfoTicker />
      </UserContext.Provider>
    </>
  );
};

export default App;
