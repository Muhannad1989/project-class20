const express = require('express');
const config = require('config');
const request = require('request');
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
    const profiles = await Profile.find({ user: request.user.id }).populate('user', [
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
    const profile = await Profile.findOne({ user: request.params.user_id }).populate('user', [
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

// @route           DELETE api/profile
// @description     DELETE profile, user & posts
// @access          Private

router.delete('/', auth, async (request, response) => {
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
});

// @route           PUT api/profile/experience
// @description     Add profile experience
// @access          Private

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is requierd')
        .not()
        .isEmpty(),
      check('company', 'Company is requierd')
        .not()
        .isEmpty(),
      check('from', 'from is requierd')
        .not()
        .isEmpty(),
    ],
  ],
  async (request, response) => {
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
  },
);

// @route           GET api/profile/user/:exp_id
// @description     Delete Experience from profile
// @access          Private

router.delete('/experience/:exp_id', auth, async (request, response) => {
  try {
    const profile = await Profile.findOne({ user: request.params.id });
    const removeIndex = profile.experience.map(item => item.id).indexOf(request.params.exp_id);
    profile.splice(removeIndex, 1);
    await profile.save();
    response.json(profile);
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Server Error');
  }
});

// @route           PUT api/profile/education
// @description     Add profile education
// @access          Private

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is requierd')
        .not()
        .isEmpty(),
      check('degree', 'Degree is requierd')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Field of study is requierd')
        .not()
        .isEmpty(),
    ],
  ],
  async (request, response) => {
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
  },
);

// @route           GET api/profile/user/:edu_id
// @description     Delete Education from profile
// @access          Private

router.delete('/education/:edu_id', auth, async (request, response) => {
  try {
    const profile = await Profile.findOne({ user: request.params.id });
    const removeIndex = profile.education.map(item => item.id).indexOf(request.params.edu_id);
    profile.splice(removeIndex, 1);
    await profile.save();
    response.json(profile);
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Server Error');
  }
});

module.exports = router;

// @route           GET api/profile/github/:username
// @description     Delete Education from profile
// @access          Public

router.get('/github/:username', auth, async (request, response) => {
  try {
    const options = {
      uri: `http://api.github.com/users/${
        request.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId',
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };
    request(options, (err, response, body) => {
      if (err) console.error(err);
      if (response.statusCode !== 200) {
        return response.status(404).send('No git hub profile found');
      }
      response.json(JSON.parse(body));
    });
    //
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Server Error');
  }
});

module.exports = router;
