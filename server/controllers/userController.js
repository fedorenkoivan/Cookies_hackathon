import User from '../models/userModel.js';

export const getProfile = async (request, reply) => {
    try {
        const userId = request.user.id;
        const user = await User.findById(userId)
        
        if (!user) {
            return reply.code(404).send({ status: 'error', message: 'User not found' });
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
        return reply.code(500).send({
            status: 'error',
            message: err.message
        });
    }
}