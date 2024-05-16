import React, { useState } from "react";
import Cookies from "js-cookie";

function PasswordForm({ current_user }) {
  const [password, setPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const [isSending, setIsSending] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSending(true);
      setError({});
      const response = await fetch(
        `${import.meta.env.VITE_API}/users/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("jwt")}`,
          },
          body: JSON.stringify({
            current_password: password,
            new_password,
            confirm_password,
          }),
        }
      );
      const res = await response.json();
      setIsSending(false);
        if (res.type === "success") {
            // update the user information
            toast.success("Password changed successfully", { theme: "dark" });
        } else if (res.type === "current_password") {
            setError({ password: res.message });
        } else if (res.type === "new_password") {
            setError({ new_password: res.message });
        } else if (res.type === "confirm_password") {
            setError({ confirm_password: res.message });
        } else {
            toast.error(res.message, { theme: "dark" });
        }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-[20px] w-full @container/pform border border-primary-500 rounded-[10px] p-[20px] bg-secondary-800 shadow-lg"
    >
      <h3 className="text-quaternary-500 text-lg font-['Montserrat'] font-light">
        Change Password
      </h3>
      <div className="w-full flex gap-[10px] flex-col @[360px]/pform:flex-row">
        <div className="flex flex-col gap-[10px] w-full">
          <label
            htmlFor="password"
            className="text-quaternary-500 text-sm font-['Montserrat'] font-light"
          >
            Current Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your current password"
            className="w-full bg-secondary-800 p-[10px] rounded-[5px] 
            border border-primary-500 hover:border-secondary-500 focus:border-secondary-400 
            text-quaternary-600 outline-none
            placeholder:text-tertiary-600 placeholder:text-sm font-light"
          />
          {error.password && (
            <p className="text-red-500 text-sm font-['Montserrat'] font-light">
              {error.password}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-[10px] w-full">
          <label
            htmlFor="new_password"
            className="text-quaternary-500 text-sm font-['Montserrat'] font-light"
          >
            New Password
          </label>
          <input
            type="password"
            id="new_password"
            value={new_password}
            onChange={handleNewPasswordChange}
            placeholder="Enter your new password"
            className="w-full bg-secondary-800 p-[10px] rounded-[5px] 
            border border-primary-500 hover:border-secondary-500 focus:border-secondary-400 
            text-quaternary-600 outline-none
            placeholder:text-tertiary-600 placeholder:text-sm font-light"
          />
          {error.new_password && (
            <p className="text-red-500 text-sm font-['Montserrat'] font-light">
              {error.new_password}
            </p>
          )}
        </div>
      </div>
      <div className="w-full flex gap-[10px] flex-col @[360px]/pform:flex-row">
        <div className="flex flex-col gap-[10px] w-full @[360px]/pform:1/2">
          <label
            htmlFor="confirm_password"
            className="text-quaternary-500 text-sm font-['Montserrat'] font-light"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm_password"
            value={confirm_password}
            onChange={handleConfirmPasswordChange}
            placeholder="Confirm your new password"
            className="w-full bg-secondary-800 p-[10px] rounded-[5px] 
            border border-primary-500 hover:border-secondary-500 focus:border-secondary-400 
            text-quaternary-600 outline-none 
            placeholder:text-tertiary-600 placeholder:text-sm font-light"
          />
          {error.confirm_password && (
            <p className="text-red-500 text-sm font-['Montserrat'] font-light">
              {error.confirm_password}
            </p>
          )}
        </div>
      </div>
      <button
        disabled={isSending || !password || !new_password || !confirm_password}
        type="submit"
        className="w-full bg-primary-700 text-tertiary-500 p-[10px] 
        rounded-[5px] font-['Montserrat'] font-light cursor-pointer 
        border border-primary-500 hover:border-secondary-500 focus:border-secondary-400
        hover:bg-primary-800 transition-all duration-300 ease-in-out flex justify-center gap-[10px]"
      >
        {isSending ? "Sending..." : "Change Password"}
      </button>
    </form>
  );
}

export default PasswordForm;
