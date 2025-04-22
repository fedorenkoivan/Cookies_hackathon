export const verifyToken = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    
    if (!token) {
      return reply.code(401).send({ 
        status: 'error', 
        message: 'You are not logged in. Please log in to get access.' 
      });
    }
    
    const decoded = await request.server.jwt.verify(token);
    
    request.user = { id: decoded.id };
    
  } catch (err) {
    return reply.code(401).send({ 
      status: 'error', 
      message: 'Invalid token or token expired' 
    });
  }
};
