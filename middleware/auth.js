const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(request, response, next) {
  // Get token header
  const token = request.header('x-auth-token');

  // Check if is token exsist
  if (!token) {
    return response.status(401).json({ msg: 'No Token, Authorization denied' });
  }

  // verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    // Need to know more about it !!
    request.user = decoded.user;
    // passing to the next functions
    next();
  } catch (error) {
    response.status(404).json({ msg: 'Token is not valid' });
  }
};
