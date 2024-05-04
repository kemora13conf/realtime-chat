import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  validateLoginData,
  login,
  register,
  requireSingin,
  validateEmail,
  validateUsername,
} from "../Controllers/auth.js";
import { answerObject } from "../Helpers/utils.js";
import upload from "../Controllers/multer-config.js";

const authRouter = Router();
authRouter.post(
  "/registration/step-1",
  validateUsername,
  validateEmail,
  (req, res) => {
    res
      .status(200)
      .json(answerObject("success", "Username and Email are available!"));
  }
);
authRouter.post(
  "/register",
  upload.single("image"),
  validateUsername,
  validateEmail,
  register
);
authRouter.post("/login", validateLoginData, login);
authRouter.get("/verifyToken", requireSingin, (req, res) => {
  res.status(200).json(answerObject("success", "User Found!", req.user));
});

export default authRouter;
