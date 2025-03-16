import mongoose from "mongoose";

const signUpSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'You must have firstname.']
    },
    lastName: {
        type: String,
        required: [true, 'You must have a lastname.']
    },
    companyEmail: {
        type: String,
        required: [true, 'Your company email is required.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    },
    role: {
        type: String,
        required: [true, 'Role is required.']
    },
    company: {
        type: String,
        required: [true, 'Company is required.']
    },
    companyType: {
        type: String,
        required: [true, 'Role is required.']
    },
})

export const signUpModel = mongoose.model('SignUp', signUpSchema);