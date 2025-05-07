import path from 'path';
import User from '../models/userModel.js';
import { createAccessToken, createRefreshToken } from '../utils/createTokens.js';
import { sendEmail } from '../utils/email.js';
import argon2 from 'argon2';

export const signup = async (request, reply) => {
  try {
    const { name, email, password, passwordConfirm } = request.body;

    const newUser = await User.create({ name, email, password, passwordConfirm });

    const accessToken = createAccessToken(request.server, newUser._id);
    const refreshToken = createRefreshToken(request.server, newUser._id);

    newUser.refreshToken = refreshToken;
    await newUser.save({ validateBeforeSave: false });

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (croissants)
      path: '/'
    });

    reply.code(201).send({
      status: 'success',
      accessToken,
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
      return reply.code(400).send({ 
        status: 'error', 
        message: 'Please provide email and password!' 
      });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return reply.code(401).send({ 
        status: 'error', 
        message: 'Incorrect email or password' 
      });
    }
    
    const isValidPassword = await user.correctPassword(password, user.password);
    if (!isValidPassword) {
      return reply.code(401).send({
        status: 'error',
        message: 'Incorrect email or password',
      });
    }

    const accessToken = createAccessToken(request.server, user._id);
    const refreshToken = createRefreshToken(request.server, user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (croissants)
      path: '/',
    });

    reply.send({ status: 'success', accessToken });

  } catch (err) {
    reply.code(500).send({ status: 'error', message: err.message });
  }
};

export const logout = async (request, reply) => {
  try {
    const refreshToken = request.cookies.refreshToken;

    reply.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    
    if (refreshToken) {
      try {
        const decoded = request.server.jwt.verify(refreshToken);
        
        if (decoded && decoded.id) {
          await User.findByIdAndUpdate(
            decoded.id,
            { refreshToken: null }
          );
        }
      } catch (tokenErr) {
        console.log('Invalid token during logout:', tokenErr.message);
      }
    }
    
    reply.send({ status: 'success', message: 'Logged out successfully' });
  } catch (err) {
    reply.code(500).send({ status: 'error', message: err.message });
  }
};

export const forgotPassword = async (request, reply) => {
  try {
    const { email } = request.body;
    
    if (!email) {
      return reply.code(400).send({ 
        status: 'error', 
        message: 'Please provide your email' 
      });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return reply.code(404).send({ 
        status: 'error', 
        message: 'No user found with that email address' 
      });
    }
    
    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    const resetURL = `${request.headers.origin}/reset-password/${resetToken}`;
    
    const message = `
      Forgot your password? Submit a request with your new password to: ${resetURL}.
      If you didn't forget your password, please ignore this email.
    `;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1d2671;">Password Reset</h2>
        <p>Hello ${user.name},</p>
        <p>Forgot your password? Click the button below to reset it:</p>
        <a href="${resetURL}" style="display: inline-block; background: linear-gradient(135deg, #1d2671, #c33764); color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; margin: 20px 0;">Reset Your Password</a>
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        <p>This link will expire in 10 minutes.</p>
        <p>Best regards,<br>The Cookies Team 🍪</p>
      </div>
    `;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
        html
      });
      
      reply.code(200).send({
        status: 'success',
        message: 'Token sent to email'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      
      return reply.code(500).send({ 
        status: 'error', 
        message: 'There was an error sending the email. Try again later.' 
      });
    }
  } catch (err) {
    reply.code(500).send({ status: 'error', message: err.message });
  }
};

export const resetPassword = async (request, reply) => {
  try {
    const { resetToken } = request.params;
    const { password, passwordConfirm } = request.body;
    
    const users = await User.find({
      passwordResetExpires: { $gt: Date.now() }
    });
    
    let user = null;
    
    for (const potentialUser of users) {
      try {
        const isValidToken = await argon2.verify(potentialUser.passwordResetToken, resetToken);
        
        if (isValidToken) {
          user = potentialUser;
          break;
        }
      } catch (err) {
        continue; // skip to the next user if verification fails
      }
    }
    
    if (!user) {
      return reply.code(400).send({ 
        status: 'error', 
        message: 'Token is invalid or has expired' 
      });
    }
    
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    
    await user.save();
    
    const accessToken = createAccessToken(request.server, user._id);
    const refreshToken = createRefreshToken(request.server, user._id);
    
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    reply.setCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/'
    });

    reply.code(200).send({
      status: 'success',
      accessToken,
    });
  } catch (err) {
    reply.code(400).send({ status: 'error', message: err.message });
  }
};

export const refresh = async (request, reply) => {
  try {
    const refreshToken = request.cookies.refreshToken;
    
    if (!refreshToken) {
      return reply.code(401).send({ status: 'error', message: 'Refresh token not found' });
    }
    
    let decoded;
    try {
      decoded = request.server.jwt.verify(refreshToken);
      
      if (decoded.scope !== 'refresh_token') {
        return reply.code(401).send({ status: 'error', message: 'Invalid token type' });
      }
    } catch (err) {
      return reply.code(401).send({ status: 'error', message: 'Invalid or expired token' });
    }
    
    const user = await User.findById(decoded.id).select('+refreshToken');
    
    if (!user) {
      return reply.code(401).send({ status: 'error', message: 'User not found' });
    }
    
    const accessToken = createAccessToken(request.server, user._id);
    
    reply.send({ status: 'success', accessToken });
  } catch (err) {
    reply.code(500).send({ status: 'error', message: err.message });
  }
};
