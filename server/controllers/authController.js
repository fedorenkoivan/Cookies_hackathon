import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN 
  });
};

export const signup = async (request, reply) => {
  try {
    const newUser = await User.create({
      name: request.body.name,
      email: request.body.email,
      password: request.body.password,
      passwordConfirm: request.body.passwordConfirm
    });
    
    const token = signToken(newUser._id);
      
    return reply.code(201).send({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    return reply.code(400).send({
      status: 'error',
      message: err.message
    });
  }
};

export const login = async (request, reply) => {
  try {
    const { email, password } = request.body;

    // FIXME: figure out the error handler and why it doesn't work without next
    if (!email || !password) {
      return reply.code(400).send({
        status: 'error',
        message: 'Please provide email and password!'
      });
    }

    const user = await User.findOne({ email }).select("+password");
  // TODO: refactor if statement

    if (!user || !(await user.correctPassword(password, user.password))) {
      return reply.code(401).send({
        status: 'error',
        message: 'Incorrect email or password'
      });
    }

    const token = signToken(user._id);
    return {
      status: 'success',
      token,
    };
  } catch (err) {
    return reply.code(500).send({
      status: 'error',
      message: err.message
    });
  }
};