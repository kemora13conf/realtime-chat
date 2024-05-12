import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // check for --host
  const host = process.argv[process.argv.indexOf("--host")];
  if (host) {
    dotenv.config({ path: `.env.host` });
  }
  
  return {
    plugins: [react()],
  };
});
