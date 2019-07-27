const Profile = require('../../../models/Profile');
const User = require('../../../models/User');

module.exports = deleteUserAndPost = async (request, response) => {
  try {
    // remove profile
    await Profile.findOneAndRemove({ user: request.user.id });

    // remove user
    await User.findOneAndRemove({ _id: request.user.id });

    response.json({ msg: 'User deleted' });
  } catch (error) {
    console.error(error);
    response.status(500).send('Server Error');
  }
};
