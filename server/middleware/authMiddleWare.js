export const verifyToken = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    let accessToken;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      accessToken = authHeader.split(' ')[1];
    }

    if (!accessToken) {
      return reply.code(401).send({ 
        status: 'error', 
        message: 'You are not logged in. Please log in to get access.' 
      });
    }
    const decoded = await request.server.jwt.verify(accessToken);    
    
    if (decoded.scope !== 'access_token') {
      return reply.code(401).send({ 
        status: 'error', 
        message: 'Invalid token type' 
      });
    }
    
    request.user = { id: decoded.id };

    return;
    
  } catch (err) {
    console.error(err);
    return reply.code(401).send({ 
      status: 'error', 
      message: 'Invalid token or token expired' 
    });
  }
};
