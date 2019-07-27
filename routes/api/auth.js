const express = require('express');
const auth = require('../../middleware/auth');
const { check } = require('express-validator');
const singIn = require('./callbacks/authentication/singIn');
const getUserProfile = require('./callbacks/authentication/getUserProfile');

// we use auth to protect this rout
const router = express.Router();

// @route           GET api/auth
// @description     Test route
// @access          Public

router.get('/', auth, getUserProfile);

// singin
// @route           GET api/auth
// @description     Register user
// @access          Public

router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is requierd ').exists(),
  ],
  singIn,
);

module.exports = router;
