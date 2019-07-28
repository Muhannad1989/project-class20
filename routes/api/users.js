const express = require('express');
// changed from 'express-validator/check' to be 'express-validator'
const User = require('../../models/User');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// @route           GET api/users
// @description     Register user
// @access          Public

router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters ').isLength({ min: 6 }),
  ],

  async (request, response) => {
    const errors = validationResult(request);
    // if they are errors
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }

    // come from the body
    const { name, email, password } = request.body;
    try {
      // check if the user exsist
      let user = await User.findOne({ email });

      if (user) {
        return response.status(404).json({ error: [{ message: 'User is already exsist' }] });
      }

      // cond of generate avatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });

      // create instance
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);
      console.log(user.password);
      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      // console.log(payload);
      // kind of compiler for id to token
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
