const jwt = require('jsonwebtoken');

module.exports = function auth(requiredRole = null) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'No token' });

    try {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};
