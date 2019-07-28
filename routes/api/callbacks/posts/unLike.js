const Post = require('../../../../models/Post');

module.exports = unLike = async (request, response) => {
  try {
    // find the post which is related to this params id
    const post = await Post.findById(request.params.id);

    // get remove index
    if (post.likes.filter(like => like.user.toString() === request.user.id).length === 0) {
      return response.status(400).json({ msg: 'Post has not yet been liked' });
    }

    // like.user.id ??
    const removeIndex = post.likes.map(like => like.user.id.toString()).indexOf(request.params.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    response.json({ msg: 'this post has been unliked' });
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return response.status(404).json({ msg: 'Post not found' });
    }
    console.error(err);
    response.send('Server Error');
  }
};
