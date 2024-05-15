import { Router } from "express";
import {
  validateLoginData,
  login,
  register,
  requireSingin,
  validateEmail,
  validateUsername,
  validateImageFile,
} from "../Controllers/auth.js";

import { SerializeUser, answerObject } from "../Helpers/utils.js";
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
  validateImageFile,
  validateUsername,
  validateEmail,
  register
);
authRouter.post("/login", validateLoginData, login);
authRouter.get("/verifyToken", requireSingin, (req, res) => {
  res
    .status(200)
    .json(
      answerObject("success", "User Found!", SerializeUser(req.current_user))
    );
});

export default authRouter;
