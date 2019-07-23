const express = require('express');
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const router = express.Router();

// @route           GET api/profile/me
// @description     Get Current user profile
// @access          Private

// get profile of user => name , avatar
router.get('/me', auth, async (request, response) => {
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
});

// @route           Post api/profile
// @description     Create or update user profile
// @access          Private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is requierd')
        .not()
        .isEmpty(),
    ],
  ],
  async (request, response) => {
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
      skills,
      facebook,
      twitter,
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
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (twitter) profileFields.social.twitter = twitter;

    // build profile object
    try {
      let profile = await profile.findOne({ user: request.user.id });

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
  },
);

// @route           GET api/profile
// @description     Get all Profiles
// @access          Public

router.get('/', auth, async (request, response) => {
  try {
    const profiles = await Profiles.find({ user: request.user.id }).populate('user', [
      'name',
      'avatar',
    ]);
    if (!profiles) {
      return response.status(400).json({ error: 'There is no profile for this user' });
    }
    response.json(profiles);
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Server Error');
  }
});

// @route           GET api/profile/user/:user_id
// @description     Get all Profile
// @access          Public

router.get('/user/:user_id', auth, async (request, response) => {
  try {
    const profile = await Profiles.findOne({ user: request.params.user_id }).populate('user', [
      'name',
      'avatar',
    ]);
    if (!profile) {
      return response.status(400).json({ error: 'Profile not found' });
    }
    response.json(profile);
  } catch (error) {
    // tow kinds of error. Invalid id or server
    if (error.kind == 'ObjectId') {
      return response.status(400).json({ error: 'Profile not found' });
    }
    response.status(500).send('Server Error');
  }
});

module.exports = router;
