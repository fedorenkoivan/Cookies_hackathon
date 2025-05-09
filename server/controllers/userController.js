import User from '../models/userModel.js';
import mongoose from 'mongoose';

export const getProfile = async (request, reply) => {
  try {
    const userId = request.user.id;
    
    // Validate the ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return reply.code(400).send({ 
        status: 'error', 
        message: 'Invalid ID format' 
      });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return reply.code(404).send({ 
        status: 'error', 
        message: 'User not found' 
      });
    }
    
    return reply.code(200).send({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      }
    });
  } catch (err) {
    console.error('Profile error:', err.message);
    return reply.code(500).send({
      status: 'error',
      message: err.message
    });
  }
};