import mongoose from "mongoose";
import CryptoJS from "crypto-js";
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { __dirname } from "../App.js";

// open the default-image.json file
let DefaultImage = {};
try {
  DefaultImage = JSON.parse(fs.readFileSync(path.join(__dirname, './Models/default-image.json')));
} catch (error) {
  DefaultImage = {
    data: Buffer.from([]),
    contentType: "image/png",
    fileName: "Avatar.png",
  };
}

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
      data: {
        type: Buffer,
        required: true,
        default: Buffer.from(DefaultImage.data, "base64"),
      },
      contentType: {
        type: String,
        required: true,
        default: DefaultImage.contentType
      },
      fileName: {
        type: String,
        required: true,
        default: DefaultImage.fileName
      },
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

// on find or findOne remove the hashed_password and salt and profile-picture.data
usersSchema.pre("find", function () {
  this.select("-profile-picture.data");
});
usersSchema.pre("findOne", function () {
  this.select("-profile-picture.data");
});

export default models.Users || model("Users", usersSchema);
