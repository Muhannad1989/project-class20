const User = require('../../../../models/User');

module.exports = getUserProfile = async (request, response) => {
  try {
    const user = await User.findById(request.user.id).select('-password');
    // redirect to another rout (user)
    response.status(200).json({ user });
  } catch (error) {
    response.status(500).json({ msg: error });
  }
};
