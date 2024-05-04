import React from 'react'
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";

function RegisterFormStep1({ register }) {
    const auth = useSelector((state) => state.auth);
    const global = useSelector((state) => state.global);
  return (
    <motion.div
      initial={{ opacity: 1, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5 }}
      className='w-full flex flex-col gap-5'
    >
      <div className="flex flex-col gap-2 ">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-quaternary-500"
        >
          Username
        </label>
        <input
          {...register("username", { reauired: true })}
          placeholder="ex: Kemora13"
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
          htmlFor="email"
          className="block text-sm font-medium text-quaternary-500"
        >
          Email Address
        </label>
        <input
          {...register("email", { reauired: true })}
          type="email"
          placeholder="ex: kemora13@gmail.com"
          className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg 
            bg-tertiary-500 placeholder:text-secondary-500 outline-none focus:ring-2
            focus:ring-secondary-200 focus:border-primary-400 block w-full p-2.5  transition-all duration-300"
        />
        {auth.errors && auth.errors.email && (
          <motion.span
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0, height: 0 }}
            className="h-0 text-sm text-red-500 overflow-hidden"
          >
            {auth.errors.email}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

export default RegisterFormStep1
