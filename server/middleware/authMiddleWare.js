export const verifyToken = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;
    let token;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    console.log(request.headers.authorization);
    console.log(request.headers);
    if (!token) {
      return reply.code(401).send({ 
        status: 'error', 
        message: 'You are not logged in. Please log in to get access.' 
      });
    }

    console.log(token);

    const decoded = await request.server.jwt.verify(token);

    console.log(decoded);
    
    
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
