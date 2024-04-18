const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const authenticationMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('No token provided');
  }

  const token = req.cookies.session_token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, passcode } = decoded;
    req.passcode = { id, passcode };
    next();
  } catch (error) {
    throw new UnauthenticatedError('Not authorized to access this route');
  }
}

module.exports = authenticationMiddleware;