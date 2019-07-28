const Post = require('../../../../models/Post');

module.exports = addLike = async (request, response) => {
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
};
