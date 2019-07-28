const Post = require('../../../../models/Post');
const User = require('../../../../models/User');
const { validationResult } = require('express-validator');

module.exports = async (request, response) => {
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
};
