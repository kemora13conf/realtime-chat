import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import ProfileImageForm from "../Components/Profile/ProfileImageForm";
import PublicForm from "../Components/Profile/PublicForm";
import PasswordForm from "../Components/Profile/PasswordForm";
import ProfileHeader from "../Components/Profile/ProfileHeader";

function Profile() {
  const current_user = useSelector((state) => state.auth.user);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full flex flex-col items-stretch overflow-y-auto gap-[30px]
      bg-secondary-700 rounded-[20px] shadow-lg border border-primary-500 
        px-[10px] py-[10px] md:p-[20px] md:py-[15px]"
    >
      <ProfileHeader current_user={current_user} />
      <div className="w-full px-[10px] flex flex-col gap-[20px]">
        <ProfileImageForm current_user={current_user} />
        <PublicForm current_user={current_user} />
        <PasswordForm current_user={current_user} />
      </div>

      {/* Footer */}
      {/* made with love */}
      <footer className="py-4 flex justify-center">
        <p className="text-sm text-quaternary-600">
          Made with <i className="fas fa-heart text-red-500 mx-[5px]"></i> by{" "}
          <a
            href="www.abdelghanielmouak.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-quaternary-500"
          >
            Abdelghani El Mouak
          </a>
        </p>
      </footer>
    </motion.div>
  );
}

export default Profile;
