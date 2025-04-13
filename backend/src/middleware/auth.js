const admin = require('../config/firebase');

exports.authMiddleware = async (req, res, next) => {
  console.log('Auth Middleware - Checking request authorization');
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No token provided or invalid format');
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    console.log('Attempting to verify token');
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log('Token verified successfully, user:', decodedToken.email);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email
    };
    
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
}; 