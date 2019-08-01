const Profile = require('../../../../models/Profile');
const User = require('../../../../models/User');
const Post = require('../../../../models/Post');

module.exports = deleteUserAndPost = async (request, response) => {
  try {
    // remove user posts

    await Profile.deleteMany({ user: request.user.id });

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
