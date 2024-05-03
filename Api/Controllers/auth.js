import Users from "../Models/Users.js";
import jwt from "jsonwebtoken";
import { answerObject } from "../Helpers/utils.js";
import Database from "../Database.js";
import { JWT_SECRET } from "../Config/index.js";

const register = async (req, res) => {
  const db = await Database.getInstance();
  if (
    !req.body.username ||
    !req.body.email ||
    !req.body.password ||
    !req.body.passwordConfirmation
  ) {
    return res
      .status(400)
      .json(answerObject("error", "Please fill in all fields"));
  }
  if (req.body.password !== req.body.passwordConfirmation) {
    return res
      .status(400)
      .json(answerObject("error", "Passwords do not match"));
  }

  try {
    const user = await Users.create(req.body);
    user.save();
    return res
      .status(201)
      .json(answerObject("success", "User created successfully", user));
  } catch (error) {
    return res.status(500).json(answerObject("error", error.message));
  }
};

const login = async (req, res) => {
  const db = await Database.getInstance();
  try {
    const user = await Users.findOne({ username: req.body.username });
    if (!user) {
      return res
        .status(200)
        .json(
          answerObject(
            "username",
            `No user with this username: ${req.body.username}`
          )
        );
    }
    if (!user.isPasswordMatch(req.body.password)) {
      return res
        .status(200)
        .json(answerObject("password", `Incorrect password!`));
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    user.password = undefined;
    return res.status(200).json(
      answerObject("success", `Logged in successefully!`, {
        user,
        token: token,
      })
    );
  } catch (error) {
    return res.status(500).json(answerObject("error", "Something went wrong!"));
  }
};

async function requireSingin(req, res, next) {
  const db = await Database.getInstance();
  try {
    const Authorization = req.headers.authorization;
    if (Authorization) {
      const token = Authorization.split(" ")[1];
      const verificationResponse = jwt.verify(token, JWT_SECRET);
      const userId = verificationResponse._id;

      const foundUser = await Users.findOne({ _id: userId });

      foundUser.password = undefined;
      if (foundUser) {
        req.user = foundUser;
        next();
      } else {
        res
          .status(401)
          .json(answerObject("error", "Wrong authentication token"));
      }
    } else {
      res
        .status(404)
        .json(answerObject("error", "Authentication token missing"));
    }
  } catch (error) {
    console.log(error.message);
    res.status(401).json({
      error: "Wrong authentication token",
    });
  }
}

export { register, login, requireSingin };
