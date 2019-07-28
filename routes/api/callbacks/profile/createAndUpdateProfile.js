const Profile = require('../../../../models/Profile');
const { validationResult } = require('express-validator');

module.exports = createAndUpdateProfile = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }
  const {
    company,
    website,
    location,
    bio,
    status,
    githubusername,
    skills, // this is array
    facebook,
    youtube,
    twitter,
    instagram,
    linkedin,
  } = request.body;

  // build profile object
  const profileFields = {};
  profileFields.user = request.user.id;
  if (company) profileFields.company = company;
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;

  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim());
  }

  // social
  profileFields.social = {};
  if (youtube) profileFields.social.youtube = youtube;
  if (facebook) profileFields.social.facebook = facebook;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (twitter) profileFields.social.twitter = twitter;
  if (instagram) profileFields.social.instagram = instagram;

  // build profile object
  try {
    let profile = await Profile.findOne({ user: request.user.id });

    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: request.user.id },
        { $set: profileFields },
        { new: true },
      );
      return response.json(profile);
    }

    // Create
    profile = new Profile(profileFields);

    await profile.save();

    response.json(profile);
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Server Error');
  }
};
