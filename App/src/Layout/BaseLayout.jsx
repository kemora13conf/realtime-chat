import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Home from "./App/Home";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../Components/Spinner";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { login, logout } from "../Store/Auth/index.js";
import { loading as GlobalLoading } from "../Store/Global/index.js";

function BaseLayout() {
  const global = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const loadCurrentUser = async () => {
    // get token from cookie
    const token = Cookies.get("jwt");
    if (token) {
      // fetch user data
      const response = await fetch(`${import.meta.env.VITE_API}/auth/verifyToken`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.type == 'success') {
          dispatch(login(data.data))
          Navigate("/");
        } else {
          dispatch(logout());
        }
      } else {
        dispatch(logout());
      }
    }
    dispatch(GlobalLoading(false));
  }
  useEffect(() => {
    loadCurrentUser();
  }, []);
  return (
    <div className="relative ">
      <AnimatePresence mode="wait">
        {global.loading && (
          <motion.div
            initial={{ backdropFilter: "blur(50px)", opacity: 1 }}
            animate={{ backdropFilter: "blur(50px)", opacity: 1 }}
            exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-screen absolute z-10 top-0 left-0 bg-transparent backdrop-blur-[50px] flex items-center justify-center"
          >
            <div className="w-8 h-8">
              <Spinner />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full h-auto absolute z-0">
        <Outlet />
      </div>
    </div>
  );
}

export default BaseLayout;
