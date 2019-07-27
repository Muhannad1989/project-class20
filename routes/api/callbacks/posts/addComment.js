const Post = require('../../../../models/Post');
const User = require('../../../../models/User');
const { validationResult } = require('express-validator');

module.exports = addComment = async (request, response) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(404).json({ errors: errors.array() });
  }
  try {
    const user = await User.findById(request.user.id).select('-password');
    const post = await Post.findById(request.params.id);
    const newComment = {
      text: request.body.text,
      name: user.name,
      avatar: user.avatar,
      user: request.user.id,
    };

    post.comments.unshift(newComment);

    await post.save();

    response.json(post.comments);
  } catch (err) {
    response.status(500).send('Server Error');
  }
};
