const jwt = require("jsonwebtoken");

// Middleware function to authenticate requests
const authGuard = (req, res, next) =>  {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
    if (token == null) return res.sendStatus(401); // No token, unauthorized
  
    jwt.verify(token, 'SECRET_KEY', (err, user) => {
      if (err) return res.sendStatus(403); // Invalid token, forbidden
  
      req.user = user; // Attach user info to request object
      next(); // Proceed to the next middleware or route handler
    });
}

module.exports = authGuard;

