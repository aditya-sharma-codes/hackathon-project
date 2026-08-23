const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  const authorization = req.headers.authorization;
  const match = typeof authorization === 'string'
    ? authorization.match(/^Bearer\s+(.+)$/i)
    : null;

  if (!match) {
    return res.status(401).json({
      error: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  try {
    req.user = jwt.verify(match[1], process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({
      error: error.name === 'TokenExpiredError'
        ? 'Session expired. Please sign in again.'
        : 'Invalid token',
      code: 'AUTH_INVALID'
    });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'You do not have permission for this action' });
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
