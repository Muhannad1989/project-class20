const Post = require('../../../../models/Post');

module.exports = addAndRemoveLike = async (request, response) => {
  try {
    // find the post which is related to this params id
    let post = await Post.findById(request.params.id);

    let result = post.likes.find(like => like.user.toString() === request.user.id);

    if (result) {
      // remove like
      let index = post.likes.indexOf(result);
      post.likes.splice(index, 1);
      await post.save();
      response.json(post.likes);
    } else {
      // add like
      post.likes.unshift({ user: request.user.id });
      await post.save();
      response.json(post.likes);
    }
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return response.status(404).json({ msg: 'Post not found' });
    }
    console.error(err);
    response.send('Server Error');
  }
};
