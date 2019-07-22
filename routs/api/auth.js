const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

// we use auth to protect this rout
const router = express.Router();

// @route           GET api/auth
// @description     Test route
// @access          Public

router.get('/', auth, async (request, response) => {
  try {
    const user = await User.findById(request.user.id).select('-password');
    // redirect to another rout (user)
    response.status(200).json({ user });
  } catch (error) {
    response.status(500).json({ msg: error });
  }
});

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

  async (request, response) => {
    const errors = validationResult(request);
    // if they are errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    // come from the body
    const { email, password } = request.body;
    try {
      // check if the user exsist / get request to the database
      let user = await User.findOne({ email });

      if (!user) {
        return response.status(400).json({ error: [{ message: 'Invalid Credentials' }] });
      }

      // match
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return response.status(400).json({ error: [{ message: 'Invalid Credentials' }] });
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 360000 }, (err, token) => {
        if (err) throw error;
        response.status(200).send({ token });
      });
    } catch (error) {
      // console.log(error.message)
      response.status(404).send('Server error');
    }
  },
);

module.exports = router;
