import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "../Spinner";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../Store/Auth/index.js";

function ProfileImageForm({ current_user }) {
  const [image, setImage] = useState(null);
  const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);

    // remove the files from the input
    e.target.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);
    const formData = new FormData();
    formData.append("image", image);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/users/profile-picture`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
          body: formData,
        }
      );
      if (response.ok) {
        const res = await response.json();
        if (res.type === "image") {
          setError(res.message);
        } else if (res.type === "error") {
          toast.error(res.message, { theme: "dark" });
        } else if (res.type === "success") {
            dispatch(updateUserProfile(current_user['profile-picture']));
          setImage(null);
        }
      }
    } catch (error) {
      toast.error("Something went wrong", { theme: "dark" });
    } finally {
        setIsSending(false);
    }
  };

  useEffect(() => {
    return () => {
      setIsSending(false);
      setImage(null);
    };
  }, []);
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex justify-center items-start gap-[10px] flex-col"
    >
      <label
        htmlFor="profile-picture"
        className="w-full flex flex-col gap-[5px]"
      >
        <span className="text-tertiary-500 text-sm font-['Montserrat']">
          Change your profile picture
        </span>
        {/* error */}
        {error && (
          <span className="text-red-500 text-sm font-['Montserrat']">
            {error}
          </span>
        )}
      </label>
      <div className="w-[150px] h-[150px] flex items-center justify-center relative">
        <img
          src={
            image
              ? URL.createObjectURL(image)
              : `${import.meta.env.VITE_API}/users/${
                  current_user.username
                }/profile-picture?token=${Cookies.get("jwt")}`
          }
          alt={current_user.username}
          className="w-[150px] h-[150px] rounded-full bg-quaternary-500 object-cover object-center 
          shadow-profile"
        />
        {isSending && (
          <div
            className="w-full h-full absolute flex items-center justify-center 
            bg-primary-700 bg-opacity-40 backdrop-blur-md rounded-full"
          >
            <div className="w-[30px] h-[30px]">
              <Spinner />
            </div>
          </div>
        )}
        <div
          className="absolute bottom-0 right-0 w-[40px] h-[40px] 
        bg-primary-500 rounded-full flex items-center justify-center cursor-pointer"
        >
          <label
            htmlFor="profile-picture"
            className="w-[40px] h-[40px] bg-primary-500 rounded-full 
            flex items-center justify-center cursor-pointer shadow-card
            border border-secondary-500 transition-all duration-300 ease-in-out
            hover:bg-primary-600 hover:border-primary-400 hover:text-quaternary-500"
          >
            <i className="fas fa-camera text-tertiary-500"></i>
            <input
              type="file"
              id="profile-picture"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
        {image && (
          <AnimatePresence mode="exit">
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              key="send"
              type="submit"
              className="absolute -right-[20px] w-[40px] h-[40px] bg-primary-500 rounded-full 
            flex items-center justify-center cursor-pointer shadow-card
            border border-secondary-500 transition-all duration-300 ease-in-out
            hover:bg-primary-600 hover:border-primary-400 hover:text-quaternary-500"
            >
              <i className="fas fa-check text-tertiary-500"></i>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
              key="close"
              type="button"
              onClick={() => {
                setImage(null);
              }}
              className="absolute -bottom-[20px] w-[40px] h-[40px] bg-primary-500 rounded-full 
            flex items-center justify-center cursor-pointer shadow-card
            border border-secondary-500 transition-all duration-300 ease-in-out
            hover:bg-primary-600 hover:border-primary-400 hover:text-quaternary-500"
            >
              <i className="fas fa-close text-tertiary-500"></i>
            </motion.button>
          </AnimatePresence>
        )}
      </div>
    </form>
  );
}

export default ProfileImageForm;
