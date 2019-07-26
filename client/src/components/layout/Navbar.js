import React, { Fragment } from 'react';

import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <Fragment>
      <nav className="navbar bg-dark">
        <h1>
          <a href="/">
            <i className="fas fa-code" /> DevConnector
          </a>
        </h1>
        <ul>
          <li>
            <a href="/!#">Developers</a>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
};

export default Navbar;
