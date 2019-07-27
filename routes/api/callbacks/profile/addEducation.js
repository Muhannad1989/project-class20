const Profile = require('../../../../models/Profile');
const { validationResult } = require('express-validator');

module.exports = addEducation = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(404).json({ errors: errors.array() });
  }

  const { school, degree, fieldofstudy, from, to, current, description } = request.body;

  const newEdu = { school, degree, fieldofstudy, from, to, current, description };
  try {
    const profile = await Profile.findOne({ user: request.user.id });

    // add new data
    profile.education.unshift(newEdu);
    await profile.save();
    response.json(profile);
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Server Error');
  }
};
