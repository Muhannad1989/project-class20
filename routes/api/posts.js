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
      response.send('Server Error');
    }
    response.status(200).send('Posts route');
  },
);

// @route           Get api/posts
// @description     Get all posts
// @access          Private

router.get('/', auth, async (request, response) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    response.json(posts);
  } catch (err) {
    response.send('Server Error');
  }
});

// @route           Get api/post:id
// @description     Get post bu ID
// @access          Private

router.get('/:id', auth, async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);
    if (!post) {
      return response.status(404).json({ msg: 'Post not found' });
    }
    response.json(post);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return response.status(404).json({ msg: 'Post not found' });
    }
    response.send('Server Error');
  }
});

// @route           Delete api/posts/:id
// @description     Delete post by ID
// @access          Private

router.delete('/:id', auth, async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);

    if (!post) {
      return response.status(404).json({ msg: 'Post mot Found' });
    }

    if (post.user.toString() !== request.user.id) {
      return response.json({ msg: 'User not authorized' });
    }
    await post.remove();
    response.json({ msg: 'Post is Removed' });
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return response.status(404).json({ msg: 'Post not found' });
    }
    response.send('Server Error');
  }
});

module.exports = router;
