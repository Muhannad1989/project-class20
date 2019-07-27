const express = require('express');
const auth = require('../../middleware/auth');
const { check } = require('express-validator');
const router = express.Router();

// callbacks function
const getCurrentUser = require('./callbacks/profile/getCurrentUser');
const createAndUpdateProfile = require('./callbacks/profile/createAndUpdateProfile');
const getAllProfiles = require('./callbacks/profile/getAllProfiles');
const getProfileById = require('./callbacks/profile/getProfileById');

const deleteUserAndPost = require('./callbacks/profile/deleteUserAndPost');
const addExperience = require('./callbacks/profile/addExperience');
const deleteExperienceById = require('./callbacks/profile/deleteExperienceById');

const addEducation = require('./callbacks/profile/addEducation');
const deleteEducation = require('./callbacks/profile/deleteEducation');

const getGithubRepository = require('./callbacks/profile/getGithubRepository');

// @route           GET api/profile/me
// @description     Get Current user profile
// @access          Private
router.get('/me', auth, getCurrentUser);

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
  createAndUpdateProfile,
);

// @route           GET api/profile
// @description     Get all Profiles
// @access          Public

router.get('/', auth, getAllProfiles);

// @route           GET api/profile/user/:user_id
// @description     Get Profile by ID
// @access          Public

router.get('/user/:user_id', auth, getProfileById);

// @route           DELETE api/profile
// @description     DELETE profile, user & posts
// @access          Private

router.delete('/', auth, deleteUserAndPost);

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
      check('from', 'From is requierd')
        .not()
        .isEmpty(),
    ],
  ],
  addExperience,
);

// @route           GET api/profile/:exp_id
// @description     Delete Experience from profile
// @access          Private

router.delete('/experience/:exp_id', auth, deleteExperienceById);

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
  addEducation,
);

// @route           GET api/profile/user/:edu_id
// @description     Delete Education from profile
// @access          Private

router.delete('/education/:edu_id', auth, deleteEducation);

module.exports = router;

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get('/github/:username', getGithubRepository);

module.exports = router;
