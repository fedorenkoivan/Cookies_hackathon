import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import { sign } from 'crypto';

const signToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  return token;
}

const signup = catchAsync(async (req, res) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  
  const token = signToken(newUser._id);
    
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // FIXME: figure out the error handler and why it doesn't work without next
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select("+password");

  // TODO: refactor if statement
  if(!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

export { signup };
export { login };