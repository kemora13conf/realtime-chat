import React, { useState } from "react";
import Spinner from "../Spinner";
import { useDispatch } from "react-redux";
import { updateUserInformation } from "../../Store/Auth/index.js";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

function PublicForm({ current_user }) {
  const [email, setEmail] = useState(current_user.email);
  const [username, setUsername] = useState(current_user.username);
  const [error, setError] = useState({});
  const [isSending, setIsSending] = useState(false);

  const dispatch = useDispatch();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError({});
    const response = await fetch(
      `${import.meta.env.VITE_API}/users/information`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("jwt")}`,
        },
        body: JSON.stringify({ email, username }),
      }
    );
    const res = await response.json();
    setIsSending(false);
    if (res.type === "success") {
      // update the user information
      dispatch(updateUserInformation({ email, username }));
      toast.success("Information updated successfully", { theme: "dark" });
    } else if (res.type === "username") {
      setError({ username: res.message });
    } else if (res.type === "email") {
      setError({ email: res.message });
    } else {
      toast.error(res.message, { theme: "dark" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-[20px] w-full @container/pform
      border border-primary-500 rounded-[10px] p-[20px] bg-secondary-800 shadow-lg"
    >
      <h3 className="text-quaternary-500 text-lg font-['Montserrat'] font-light">
        Public Information
      </h3>
      <div className="w-full flex gap-[10px] flex-col @[360px]/pform:flex-row">
        <div className="flex flex-col gap-[10px] w-full @[360px]/pform:w-2/5">
          <label
            htmlFor="username"
            className="text-quaternary-500 text-sm font-['Montserrat'] font-light"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter your username"
            className="w-full bg-secondary-800 p-[10px] rounded-[5px] 
            border border-primary-500 hover:border-secondary-500 focus:border-secondary-400 
            text-quaternary-600 outline-none
            placeholder:text-tertiary-600 placeholder:text-sm font-light"
          />
          {error.username && (
            <p className="text-red-500 text-sm font-['Montserrat'] font-light">
              {error.username}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-[10px] w-full @[360px]/pform:w-3/5">
          <label
            htmlFor="email"
            className="text-quaternary-500 text-sm font-['Montserrat'] font-light"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            className="w-full bg-secondary-800 p-[10px] rounded-[5px] 
            border border-primary-500 hover:border-secondary-500 focus:border-secondary-400 
            text-quaternary-600 outline-none
            placeholder:text-tertiary-600 placeholder:text-sm font-light"
          />
          {error.email && (
            <p className="text-red-500 text-sm font-['Montserrat'] font-light">
              {error.email}
            </p>
          )}
        </div>
      </div>
      <button
        disabled={
          isSending ||
          !email ||
          !username ||
          (current_user.email === email && current_user.username === username)
        }
        type="submit"
        className="w-full bg-primary-700 text-tertiary-500 p-[10px] 
        rounded-[5px] font-['Montserrat'] font-light cursor-pointer 
        border border-primary-500 hover:border-secondary-500 focus:border-secondary-400
        hover:bg-primary-800 transition-all duration-300 ease-in-out flex justify-center gap-[10px]"
      >
        {isSending && (
          <div className="h-[25px] aspect-square ">
            <Spinner />
          </div>
        )}
        {isSending ? "Saving " : "save "} Changes
      </button>
    </form>
  );
}

export default PublicForm;
