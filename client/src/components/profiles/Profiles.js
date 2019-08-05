import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfiles } from '../../actions/profile';
import ProfileItem from './ProfileItem';

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {
  // as soon as this page get loaded we gonna have profiles
  useEffect(() => {
    getProfiles();
  }, [getProfiles]);
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <h1 className="large  text-primary">Developers</h1>
          <p className="lead">
            <i className="fab fa-connectdevelop" />
            Browse and connect with developers
          </p>
          <div className="profiles">
            {profiles.length > 0 ? (
              profiles.map(profile => <ProfileItem key={profile._id} profile={profile} />)
            ) : (
              <h2>there is no profiles</h2>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  profile: state.profile,
});
export default connect(
  mapStateToProps,
  { getProfiles },
)(Profiles);