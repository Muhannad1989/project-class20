const Profile = require('../../../models/Profile');

module.exports = getProfileById = async (request, response) => {
  try {
    const profile = await Profile.findOne({ user: request.params.user_id }).populate('user', [
      'name',
      'avatar',
    ]);
    if (!profile) {
      return response.status(400).json({ msg: 'Profile not found' });
    }
    response.json(profile);
  } catch (error) {
    // Tow kinds of error.
    if (error.kind == 'ObjectId') {
      return response.status(400).json({ msg: 'Profile not found' });
    }
    response.status(500).send('Server Error');
  }
};
