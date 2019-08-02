import React from 'react';
import PropTypes from 'prop-types';

import Moment from 'react-moment';
import moment from 'moment';

const ProfileExperience = ({
  experience: { company, title, location, current, from, to, description },
}) => (
  <div>
    <h3 class="text-dark">{company}</h3>
    <p>
      <Moment format="YYYY/MM/DD">{from}</Moment> -
      {!to ? 'NOW ' : <Moment format="YYYY/MM/DD">{to}</Moment>}
    </p>
    <p>
      <strong>Title: </strong>
      {title}
    </p>
    <p>
      <strong>Description: </strong>
      {description}
    </p>
    <p>
      <strong>Location: </strong>
      {location}
    </p>
  </div>
);

ProfileExperience.propTypes = {
  experience: PropTypes.array.isRequired,
};

export default ProfileExperience;
