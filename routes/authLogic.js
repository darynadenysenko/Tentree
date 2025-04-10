const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Hash the user's password before storing
function hashPassword(password) {
  const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
  return bcrypt.hash(password, saltRounds);
}

// Verify user's entered password with the hashed password from DB
function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

// Generate a JWT token for a logged-in user
function generateToken(user) {
  return jwt.sign(
    { id: user.ID, email: user.Email }, 
    process.env.JWT_SECRET,             
    { expiresIn: '7d' }                 
  );
}

// Verify a JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

// Export all functions
module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken
};
