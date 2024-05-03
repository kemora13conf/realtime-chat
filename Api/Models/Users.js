import mongoose from "mongoose";
import CryptoJS from "crypto-js";
import { JWT_SECRET } from "../Config/index.js";

const { model, models } = mongoose;

const usersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
    },
    profilePicture: {
      type: String,
      default: "Avatar.png",
    },
    socket: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to encrypt the password
usersSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = CryptoJS.SHA256(this.password, JWT_SECRET);
  }
  next();
});
usersSchema.methods = {
  isPasswordMatch(password) {
    return CryptoJS.SHA256(password, JWT_SECRET).toString() === this.password;
  },
};

export default models.Users || model("Users", usersSchema);
