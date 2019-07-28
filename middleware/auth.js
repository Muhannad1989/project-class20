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

    // will be like below
    // { user: { id: '5d3d3ff450b9412cbc4ccc20' },
    // iat: 1564295581,
    // exp: 1564655581 }

    // inject the request to with user object
    request.user = decoded.user;

    // passing to the next functions
    next();
  } catch (error) {
    response.status(404).json({ msg: 'Token is not valid' });
  }
};
