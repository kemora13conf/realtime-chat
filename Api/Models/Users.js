import mongoose from "mongoose";
import CryptoJS from "crypto-js";

const { model, models } = mongoose;

const usersSchema = new mongoose.Schema({
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
});

// Pre-save middleware to encrypt the password
usersSchema.pre('save', function(next) {
    if (this.isModified('password')) {
      const encryptedPassword = CryptoJS.AES.encrypt(this.password, process.env.JWT_SECRET).toString();
      this.password = encryptedPassword;
    }
    next();
  });
usersSchema.methods = { 
    // Method to decrypt the password
    decryptPassword: function() {
        const bytes = CryptoJS.AES.decrypt(this.password, process.env.JWT_SECRET);
        const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
        return originalPassword;
    },
};

export default models.Users || model("Users", usersSchema);