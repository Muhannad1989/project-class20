const Post = require('../../../../models/Post');

module.exports = getPostById = async (request, response) => {
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
};
