import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { logout } from './../../actions/auth';

const Navbar = ({ auth: isAuthenticated, loading }, logout) => {
  const authLink = (
    <ul>
      <li>
        <Link to="/profiles">Profiles</Link>
      </li>
      <li>
        <Link onClick={logout} to="#!">
          <i className="fas fa-sing-out-alt" /> <span className="hide-sm"> Logout</span>
        </Link>
      </li>
      <li>
        <Link to="/posts">Posts</Link>
      </li>
    </ul>
  );

  const gustLink = (
    <ul>
      <li>
        <Link to="/profiles">Profiles</Link>
      </li>
      <li>
        <a href="#!">Developers</a>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );
  return (
    <Fragment>
      <nav className="navbar bg-dark">
        <h1>
          <a href="/">
            <i className="fas fa-code" /> DevConnector
          </a>
        </h1>
        {!loading && <Fragment> {isAuthenticated ? gustLink : authLink} </Fragment>}
        {/* {!loading ? '' : null} */}
      </nav>
    </Fragment>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapSateToProps = state => ({
  auth: state.auth,
});
export default connect(
  mapSateToProps,
  { logout },
)(Navbar);
