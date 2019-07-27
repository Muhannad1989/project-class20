const Post = require('../../../models/Post');

module.exports = removePostById = async (request, response) => {
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
};
