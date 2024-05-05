import { Outlet, useNavigate } from "react-router-dom";
import Login from "../../Layout/Auth/Login";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Protected = () => {
  const auth = useSelector((state) => state.auth);
  const global = useSelector((state) => state.global);
  const Navigate = useNavigate();
  useEffect(() => {
    if (!global.loading && !auth.isAuthenticated) {
      Navigate("/login");
    }
  }, [auth.isAuthenticated]);
  return auth.isAuthenticated ? <Outlet /> : null;
};

export default Protected;
