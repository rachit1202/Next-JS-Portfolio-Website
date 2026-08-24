const authenticate = async (request, reply) => {
  // Allow CORS OPTIONS preflight requests without authentication check
  if (request.method === 'OPTIONS') {
    return;
  }

  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: true, message: 'Authentication token is required.' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = await request.jwtVerify();
    request.user = decoded;
  } catch (err) {
    return reply.code(401).send({ error: true, message: 'Invalid or expired authentication token.' });
  }
};

module.exports = { authenticate };
