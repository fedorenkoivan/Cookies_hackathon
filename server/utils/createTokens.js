export const createAccessToken = (fastify, userId) => {
    return fastify.jwt.sign(
      {
        id: userId,
        scope: 'access_token',
       },
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        subject: userId.toString(),
      }
    );
};
  
export const createRefreshToken = (fastify, userId) => {
  return fastify.jwt.sign(
    {
      id: userId,
      scope: 'refresh_token',
     },
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
      subject: userId.toString(),
    }
  );
};