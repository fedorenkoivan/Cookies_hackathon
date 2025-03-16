import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same!'
        }
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    const salt_rounds = 12;
    const salt = await bcrypt.genSalt(salt_rounds);

    this.password = await bcrypt.hash(this.password, salt);
    this.passwordConfirm = undefined;
    next();
  });
  
userSchema.methods.correctPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model("User", userSchema);
export default User;