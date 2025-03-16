import mongoose from "mongoose";

const logInSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'], 
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        default: 'ilovemom'
    },
})

export const logInModel = mongoose.model('LogIn', logInSchema);