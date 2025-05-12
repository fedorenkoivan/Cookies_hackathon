import { User } from '../models/userModel.js';
import { createError } from '../utils/errorUtils.js';

export const getProfile = async (request, reply) => {
  const userId = request.user.id;
  
  const user = await User.findById(userId);
  
  if (!user) {
    throw createError(404, 'User not found');
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
};