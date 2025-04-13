import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs';
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

userSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
}
const User = mongoose.model("User", userSchema);
export default User;