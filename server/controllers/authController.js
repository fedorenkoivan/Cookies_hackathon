import User from '../models/userModel.js';
import { createToken } from '../utils/createToken.js';

// ok or not?
const isValidUser = async (user, password) => user && await user.correctPassword(password, user.password);

export const signup = async (request, reply) => {
  try {
    const { name, email, password, passwordConfirm } = request.body;

    const newUser = await User.create({ name, email, password, passwordConfirm });

    const token = createToken(request.server, newUser._id);

    reply.code(201).send({
      status: 'success',
      token,
      data: { user: { id: newUser._id, name: newUser.name, email: newUser.email } },
    });
  } catch (err) {
    reply.code(400).send({ status: 'error', message: err.message });
  }
};

export const login = async (request, reply) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.code(400).send({ status: 'error', message: 'Please provide email and password!' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!isValidUser(user, password)) {
      return reply.code(401).send({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    const token = createToken(request.server, user._id);

    reply.send({ status: 'success', token });
  } catch (err) {
    reply.code(500).send({ status: 'error', message: err.message });
  }
};

//TODO: Implement logout functionality
