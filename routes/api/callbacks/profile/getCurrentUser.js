const Profile = require('../../../../models/Profile');

module.exports = getCurrentUser = async (request, response) => {
  try {
    const profile = await Profile.findOne({ user: request.user.id }).populate('user', [
      'name',
      'avatar',
    ]);
    if (!profile) {
      return response.status(400).json({ error: 'There is no profile for this user' });
    }
    response.json(profile);
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Server Error');
  }
};
