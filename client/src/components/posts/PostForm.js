import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from './../../actions/post';
const PostForm = ({ addPost, currentText }) => {
  let data;
  if (currentText) {
    data = currentText;
  } else {
    data = '';
  }
  const [text, setText] = useState(data);
  const [edit, setEdit] = useState(null);
  return (
    <div class="post-form">
      <div class="bg-primary p">
        <h3>Say Something...</h3>
      </div>
      <form
        class="form my-1"
        onSubmit={e => {
          e.preventDefault();
          addPost({ text });
          setText('');
        }}
      >
        <textarea
          name="text"
          value={text}
          onChange={e => setText(e.target.value)}
          cols="30"
          rows="5"
          placeholder="Create a post"
          required
        />
        <input type="submit" class="btn btn-dark my-1" value="Submit" />
        <button onClick={() => setEdit(false)} class="btn btn my-1">
          Cancel
        </button>
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};
const mapStateToProps = state => ({
  post: state.post,
});

export default connect(
  mapStateToProps,
  { addPost },
)(PostForm);
