// Client/src/components/ProtectedRoute.js
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../App";

const ProtectedRoute = ({ children }) => {
  const { state } = useContext(UserContext);

  // state === true  -> logged in
  // state === false -> logged out
  if (!state) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
