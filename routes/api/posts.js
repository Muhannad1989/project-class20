const express = require('express');
//config
const config = require('config');
const auth = require('../../middleware/auth');
// models
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const User = require('../../models/User');

const { check, validationResult } = require('express-validator');

const router = express.Router();

// @route           POST api/posts
// @description     Test route
// @access          Private

router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is requierd')
        .not()
        .isEmpty(),
    ],
  ],
  async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(404).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(request.user.id).select('-password');
      const newPost = new Post({
        text: request.body.text,
        name: user.name,
        avatar: user.avatar,
        user: request.user.id,
      });
      const post = await newPost.save();
      response.json(post);
    } catch (err) {
      console.log(err);
      response.send('Server Error');
    }
    response.status(200).send('Posts route');
  },
);

module.exports = router;
