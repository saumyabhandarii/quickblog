// server/middleware/auth.js
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. Check if Authorization header exists and is well-formed
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: No token provided in Authorization header',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user info to request
    req.user = decoded;

    // 4. Move to next middleware/route
    next();
  } catch (error) {
    console.error('JWT verification failed:', error.message); // ✅ Helpful for logs

    return res.status(401).json({
      success: false,
      message:
        error.name === 'TokenExpiredError'
          ? 'Unauthorized: Token has expired'
          : 'Unauthorized: Invalid token',
    });
  }
};

export default auth;
