const Profile = require('../../../models/Profile');
const { validationResult } = require('express-validator');

module.exports = addExperience = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(404).json({ errors: errors.array() });
  }

  const { title, company, location, from, to, current, description } = request.body;

  const newExp = { title, company, location, from, to, current, description };
  try {
    const profile = await Profile.findOne({ user: request.user.id });

    // add new data
    profile.experience.unshift(newExp);
    await profile.save();
    response.json(profile);
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Server Error');
  }
};
