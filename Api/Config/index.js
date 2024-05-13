import Dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
Dotenv.config({
  path: path.join(
    __dirname,
    `../.env.${process.env.NODE_ENV || "development"}`
  ),
});

export const { PORT, MONGO_DB, CORS_ORIGIN, JWT_SECRET, NODE_ENV } = process.env;
