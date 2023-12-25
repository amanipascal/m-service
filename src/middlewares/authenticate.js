const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
    const accessToken = req.headers['authorization'];
    if (!accessToken) {
      return res.status(401).json('Access Denied. No token provided.');
    }
  
    try {
      const decoded = jwt.verify(accessToken, secretKey);
      req.user = decoded.userId;
      next();
    } catch (error) {
      return res.status(400).json('Token invalide.');
    }
  };

  module.exports = authenticate