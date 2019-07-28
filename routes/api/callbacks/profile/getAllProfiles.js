const Profile = require('../../../../models/Profile');

module.exports = getAllProfiles = async (request, response) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    if (!profiles) {
      return response.status(400).json({ error: 'There is no profile for this user' });
    }
    response.json(profiles);
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Server Error');
  }
};
