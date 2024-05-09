import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import RegisterFormStep1 from "../../Components/Auth/RegisterFormStep1.jsx";
import RegisterFormStep2 from "../../Components/Auth/RegisterFormStep2.jsx";
import { loading as GlobalLoading } from "../../Store/Global/index.js";
import {
  loading as AuthLoading,
  setRegistrationStep,
  setRegistrationData,
  errors,
} from "../../Store/Auth/index.js";
import Spinner from "../../Components/Spinner.jsx";
import Cookies from "js-cookie";
import RegisterFormStep3 from "../../Components/Auth/RegisterFormStep3.jsx";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Register = function () {
  const { register, handleSubmit } = useForm();
  const auth = useSelector((state) => state.auth);
  const global = useSelector((state) => state.global);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  
  let [imageFileContext, setImageFileContext] = useState(null);
  const onSubmit = async function (data) {
    dispatch(AuthLoading(true));
    if (auth.registration.step == 1) {
      const response = await fetch(
        `${import.meta.env.VITE_API}/auth/registration/step-1`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
          body: JSON.stringify({
            username: data.username,
            email: data.email,
          }),
        }
      );
      if (response.ok) {
        const res = await response.json();
        if (res.type == "success") {
          dispatch(errors({}));
          dispatch(
            setRegistrationData({
              username: data.username,
              email: data.email,
            })
          );
          dispatch(setRegistrationStep(2));
        } else if (res.type == "username") {
          dispatch(errors({ username: res.message }));
        } else if (res.type == "email") {
          dispatch(errors({ email: res.message }));
        }
      } else {
        toast.error("An error occured, please try again later!");
      }
    } else if (auth.registration.step == 2) {
      if (!data.password) {
        dispatch(errors({ password: "Password is required!" }));
      } else if (data.password.length < 6) {
        dispatch(errors({ password: "Password length must be atleast 6!" }));
      } else if (data.password != data.confirm_password) {
        dispatch(errors({ confirm_password: "Password isn't matched!" }));
      } else {
        dispatch(errors({}));
        dispatch(
          setRegistrationData({
            password: data.password,
            confirm_password: data.confirm_password,
          })
        );
        dispatch(setRegistrationStep(3));
      } 
    } else if (auth.registration.step == 3) {
      const formData = new FormData();
      formData.append("image", imageFileContext);
      formData.append("username", auth.registration.data.username);
      formData.append("email", auth.registration.data.email);
      formData.append("password", auth.registration.data.password);
      const response = await fetch(
        `${import.meta.env.VITE_API}/auth/register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const res = await response.json();
        if (res.type == "success") {
          dispatch(errors({}));
          toast.success("Account created successfully!", {theme:'dark'});
          Navigate("/login");
        } else if (res.type == "username") {
          dispatch(errors({ username: res.message }));
          dispatch(setRegistrationStep(1));
        } else if (res.type == "email") {
          dispatch(errors({ email: res.message }));
          dispatch(setRegistrationStep(1));
        } else if (res.type == "password") {
          dispatch(errors({ password: res.message }));
          dispatch(setRegistrationStep(2));
        } else if (res.type == "image") {
          dispatch(errors({ image: res.message }));
          dispatch(setRegistrationStep(3));
        }
      } else {
        toast.error("An error occured, please try again later!");
      }
    }
    dispatch(AuthLoading(false));
  };
  useEffect(() => {
    if (!global.loading) {
      dispatch(GlobalLoading(false));
    }
    return () => {
      dispatch(GlobalLoading(true));
      dispatch(setRegistrationStep(1));
      dispatch(setRegistrationData({}));
      dispatch(errors({}));
      setImageFileContext(null);
    };
  }, []);
  return (
    <motion.div
      key={"Register"}
      className="w-full min-h-screen flex flex-col justify-center items-center 
            bg-primary-600 "
    >
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 max-w-md w-full h-fit p-4 px-8 
                 rounded-lg shadow-md"
      >
        <div className="w-full flex flex-col gap-1 my-4">
          <h1 className="text-2xl font-bold text-tertiary-200">Sign up</h1>
          <p className="text-tertiary-500 font-light font-['Poppins-light'] text-sm">
            Create an account to start chatting with your friends
          </p>
        </div>

        <AnimatePresence mode="wait">
          {auth.registration.step == 1 ? (
            <RegisterFormStep1 register={register} />
          ) : auth.registration.step == 2 ? (
            <RegisterFormStep2 register={register} />
          ) : (
            <RegisterFormStep3
              register={register}
              setImageFileContext={setImageFileContext}
            />
          )}
        </AnimatePresence>

        <button
          type="submit"
          className="px-5 py-3 mt-4 flex items-center justify-center gap-3 rounded-md 
          cursor-pointer bg-primary-700 text-tertiary-500"
        >
          {auth.loading ? (
            <div className="w-[20px] h-[20px]">
              <Spinner />
            </div>
          ) : null}
          {auth.registration.step < 3 ? "Next" : "Register"}
        </button>
        {/* if you already have an account  */}
        <div className="flex gap-2 pl-2 items-center">
          <span className="text-tertiary-400 text-sm font-light font-['Poppins-light']">
            Already have an account?{" "}
          </span>
          <Link to="/login" className="text-tertiary-400">
            Sign in
          </Link>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default Register;
