import React from 'react'
import { useSelector } from 'react-redux';
import { motion } from "framer-motion";

function RegisterFormStep2({ register }) {
    
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
          htmlFor="password"
          className="block text-sm font-medium text-quaternary-500"
        >
          Password
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
      <div className="flex flex-col gap-2 ">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-quaternary-500"
        >
          Confirm Password
        </label>
        <input
          type="password"
          {...register("confirm_password", { reauired: true })}
          placeholder="••••••••"
          className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg 
            bg-tertiary-500 placeholder:text-secondary-500 outline-none focus:ring-2
            focus:ring-secondary-200 focus:border-primary-400 block w-full p-2.5  transition-all duration-300"
        />
        {auth.errors && auth.errors.confirm_password && (
          <motion.span
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            exit={{ opacity: 0, height: 0 }}
            className="h-0 text-sm text-red-500 overflow-hidden"
          >
            {auth.errors.confirm_password}
          </motion.span>
        )}
      </div>
    </motion.div>
  );
}

export default RegisterFormStep2
