export const createToken = (fastify, userId) => {
    return fastify.jwt.sign(
      { id: userId },
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
        subject: userId.toString(),
      }
    );
  };