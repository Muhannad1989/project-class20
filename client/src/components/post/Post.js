import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import PostItem from './../posts/PostItem';
import { getPost } from './../../actions/post';
import { Link, withRouter } from 'react-router-dom';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

// add history to redirect to posts when something wrong
const Post = ({ getPost, history, post: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id, history);
  }, [getPost, match.params.id, history]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to="/posts" className="btn">
        Back To Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className="fsd">
        {post.comments.map(comment => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </Fragment>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  post: state.post,
});
export default connect(
  mapStateToProps,
  { getPost },
)(withRouter(Post));
