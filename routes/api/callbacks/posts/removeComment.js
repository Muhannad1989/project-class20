const Post = require('../../../models/Post');

module.exports = removeComment = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);

    // Pull out comment
    const comment = post.comments.find(comment => comment.id === request.params.comment_id);

    // Make sure comment exsist
    if (!comment) {
      return response.status(404).json({ msg: 'Comment dose not exsist' });
    }

    // Check user
    if (comment.user.toString() !== request.user.id) {
      return response.status(401).json({ msg: 'User not authorized' });
    }

    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(request.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    response.json(post.comments);
  } catch (err) {
    console.error(err);
    response.send('Server Error');
  }
};
