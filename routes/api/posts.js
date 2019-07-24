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

// @route           Update api/posts/like/:id
// @description     Add Like to post by ID
// @access          Private

router.put('/like/:id', auth, async (request, response) => {
  try {
    // find the post which is related to this params id
    const post = await Post.findById(request.params.id);

    // check if the post has already been liked
    // go to post => likes
    // match logged user with the same id as params
    // if has the length bigger than 0 that means "is already exsist"
    if (post.likes.filter(like => like.user.toString() === request.user.id).length > 0) {
      return response.status(400).json({ msg: 'Post already liked' });
    }
    post.likes.unshift({ user: request.user.id });
    await post.save();

    response.json(post.likes);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return response.status(404).json({ msg: 'Post not found' });
    }
    console.error(err);
    response.send('Server Error');
  }
});

// @route           Update api/posts/unlike/:id
// @description     Unlike post
// @access          Private

router.put('/unlike/:id', auth, async (request, response) => {
  try {
    // find the post which is related to this params id
    const post = await Post.findById(request.params.id);

    // get remove index
    if (post.likes.filter(like => like.user.toString() === request.user.id).length === 0) {
      return response.status(400).json({ msg: 'Post has not yet been liked' });
    }
    const removeIndex = post.likes.map(like => like.user.id.toString()).indexOf(request.params.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    response.json(post.likes);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return response.status(404).json({ msg: 'Post not found' });
    }
    console.error(err);
    response.send('Server Error');
  }
});
module.exports = router;
