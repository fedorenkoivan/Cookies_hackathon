import mongoose from "mongoose";
import validator from "validator";
import argon2 from "argon2";
import crypto from "crypto";
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
    },
    passwordResetToken: String,
    passwordResetExpires: Date
});

userSchema.pre('save', hashUserPassword);

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await argon2.verify(userPassword, candidatePassword);
};

userSchema.methods.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = await argon2.hash(resetToken, {
        type: argon2.argon2id,
        memoryCost: 16384,
        timeCost: 2,
        parallelism: 1,
        hashLength: 32
    });
    
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 хвилин
    
    return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;