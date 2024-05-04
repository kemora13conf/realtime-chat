import { Outlet, useNavigate } from "react-router-dom";
import Login from "../../Layout/Auth/Login";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Protected = () => {
  const auth = useSelector((state) => state.auth);
  const Navigate = useNavigate();
  useEffect(() => {
    if (!auth.isAuthenticated) {
      Navigate("/login");
    }
  }, [auth.isAuthenticated]);
  return auth.isAuthenticated ? <Outlet /> : <Login />;
};

export default Protected;
