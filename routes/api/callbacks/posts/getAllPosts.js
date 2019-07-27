const Post = require('../../../models/Post');

module.exports = getAllPosts = async (request, response) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    response.json(posts);
  } catch (err) {
    response.send('Server Error');
  }
};
