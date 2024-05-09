import mongoose from "mongoose";
import CryptoJS from "crypto-js";
import bcrypt from 'bcrypt';
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
    token: {
      type: String,
      default: "",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    "profile-picture": {
      type: String,
      default: "Avatar.png",
    },
    last_seen: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to encrypt the password
usersSchema.pre("save", async function (next) {
  if (this.isModified("hashed_password")) {
    this.salt = await bcrypt.genSalt(10);
    this.hashed_password = CryptoJS.SHA256(this.hashed_password, this.salt);
  }
  next();
});
usersSchema.methods = {
  isPasswordMatch(password) {
    return this.hashed_password === CryptoJS.SHA256(password, this.salt).toString();
  },
};

export default models.Users || model("Users", usersSchema);
