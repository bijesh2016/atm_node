// authentication.js
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Dummy user for demonstration
const DEMO_USER = {
  id: '1',
  email: 'demo@example.com',
  password: bcrypt.hashSync('password123', 10), // hashed password
  role: 'USER',
};

const JWT_SECRET = 'demo_jwt_secret';

// Middleware: Session and Cookie Auth
function sessionCookieAuth(req, res, next) {
  const sessionId = req.session?.sessionId || req.cookies?.sessionId;
  if (sessionId && req.session.userId) {
    req.user = { id: req.session.userId, email: DEMO_USER.email, role: DEMO_USER.role };
    return next();
  }
  // Fallback to JWT (optional)
  const token = req.headers['authorization']?.replace('Bearer ', '').trim();
  if (token) {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = { id: payload.sub, email: DEMO_USER.email, role: DEMO_USER.role };
      return next();
    } catch (err) {
      // ignore
    }
  }
  return res.status(401).json({ message: 'Unauthorized' });
}

// Controller: Login
async function loginController(req, res) {
  const { email, password } = req.body;
  if (email !== DEMO_USER.email || !bcrypt.compareSync(password, DEMO_USER.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  // Generate JWT
  const accessToken = jwt.sign({ sub: DEMO_USER.id, type: 'Bearer' }, JWT_SECRET, { expiresIn: '1h' });
  // Set session
  req.session.userId = DEMO_USER.id;
  req.session.sessionId = 'demo-session-id';
  // Set cookie
  res.cookie('sessionId', 'demo-session-id', {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax',
  });
  return res.json({
    message: 'Login successful',
    accessToken,
    sessionId: 'demo-session-id',
  });
}

// Controller: Protected Route
function protectedController(req, res) {
  return res.json({ message: 'You are authenticated', user: req.user });
}

// Router setup
router.post('/login', loginController);
router.get('/protected', sessionCookieAuth, protectedController);

// Export for use in an Express app
module.exports = {
  authenticationRouter: router,
  sessionCookieAuth,
}; 