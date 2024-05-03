import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loading as GlobalLoading } from "../../Store/Global/index.js";
import { errors, loading as AuthLoading, login } from "../../Store/Auth/index.js";
import Spinner from "../../Components/Spinner.jsx";

const Login = function () {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const global = useSelector((state) => state.global);
  const Navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const onSubmit = function (data) {
    dispatch(AuthLoading(true));

    fetch(`${import.meta.env.VITE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.type == "success") {
          dispatch(errors({}));
          var expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 3);
          document.cookie = `jwt=${encodeURIComponent(res.data.token)};expires=${expirationDate};path=/`;
          dispatch(login(res.data.user));
          Navigate("/");
        } else if (res.type == "username") {
          dispatch(errors({ username: res.message }));
        } else if (res.type == "password") {
          dispatch(errors({ password: res.message }));
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        dispatch(AuthLoading(false));
      });
  };
  useEffect(() => {
    if (!global.loading) {
      dispatch(GlobalLoading(false));
    }
    return () => {
      dispatch(GlobalLoading(true));
    };
  }, []);
  return (
    <motion.div className="relative w-full min-h-screen flex flex-col justify-center items-center bg-primary-500">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="absolute flex flex-col gap-5 max-w-md w-full h-fit p-8 px-10 bg-secondary-600 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-bold text-tertiary-200 my-4">
          Sign in to your account
        </h1>
        <div className="flex flex-col gap-2 ">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-quaternary-500"
          >
            Username or Email
          </label>
          <input
            {...register("username", { reauired: true })}
            placeholder="Kemora or kemora@gmail.com"
            className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg 
            bg-tertiary-500 placeholder:text-secondary-500 outline-none focus:ring-2
            focus:ring-secondary-200 focus:border-primary-400 block w-full p-2.5  transition-all duration-300"
          />
          {auth.errors && auth.errors.username && (
            <motion.span
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, height: 0 }}
              className="h-0 text-sm text-red-500 overflow-hidden"
            >
              {auth.errors.username}
            </motion.span>
          )}
        </div>
        <div className="flex flex-col gap-2 ">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-quaternary-500"
          >
            password
          </label>
          <input
            type="password"
            {...register("password", { reauired: true })}
            placeholder="••••••••"
            className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg 
            bg-tertiary-500 placeholder:text-secondary-500 outline-none focus:ring-2
            focus:ring-secondary-200 focus:border-primary-400 block w-full p-2.5  transition-all duration-300"
          />
          {auth.errors && auth.errors.password && (
            <motion.span
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, height: 0 }}
              className="h-0 text-sm text-red-500 overflow-hidden"
            >
              {auth.errors.password}
            </motion.span>
          )}
        </div>
        <button
          type="submit"
          className="px-5 py-3 mt-4 flex items-center justify-center gap-3 rounded-md cursor-pointer bg-primary-600 text-tertiary-500"
        >
          {auth.loading ? (
            <div className="w-[20px] h-[20px]">
              <Spinner />
            </div>
          ) : null}
          Sign in
        </button>
        {/* if you already have an account  */}
        <div className="flex gap-2 pl-2 items-center">
          <span className="text-tertiary-400 text-sm font-light font-['Poppins-light']">
            Don't have an account?{" "}
          </span>
          <Link to="/register" className="text-tertiary-400">
            Register
          </Link>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default Login;
