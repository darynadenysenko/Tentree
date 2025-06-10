

const auth = require('../routes/authLogic');

function authenticateToken(req, res, next) {

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  // Verify the token
  const user = auth.verifyToken(token);
  if (!user) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }

  // Attach user information to request object
  req.user = user;

  // Move to next middleware or route handler
  next();
}

module.exports = authenticateToken;