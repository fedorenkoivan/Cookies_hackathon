export const verifyToken = async (request, reply) => {
    try {
      const token = request.headers.authorization?.split(' ')[1];
  
      if (!token) {
        return reply.code(401).send({ status: 'error', message: 'Token is missing!' });
      }
  
      const decoded = await request.server.jwt.verify(token);
      request.user = decoded;
  
      return;
    } catch (err) {
      return reply.code(401).send({ status: 'error', message: 'Invalid or expired token!' });
    }
  };

//TODO: double check the verification is correct  
