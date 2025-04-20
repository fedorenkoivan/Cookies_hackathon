import mongoose from "mongoose";
import validator from "validator";
import argon2 from "argon2";
import { hashUserPassword } from '../middleware/hashPasswordMiddleware.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: validator.isEmail
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: true,
        validate: {
            validator: function (el) {
                return el === this.password;
            }
        }
    }
});

userSchema.pre('save', hashUserPassword);

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await argon2.verify(userPassword, candidatePassword);
}
const User = mongoose.model("User", userSchema);
export default User;