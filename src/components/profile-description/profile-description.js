import React from 'react';
import PropTypes from 'prop-types';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ProfileDescription = ({
  personName,
  jobTitle,
  location,
  qualifications,
}) => {
  return (
    <div>
      <h1 className="inline">{personName}</h1>
      <h4 className="mb-0">{jobTitle}</h4>
      {location && (
        <h4 className="mb-0">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
          {location}
        </h4>
      )}
      {qualifications && <strong>{qualifications}</strong>}
    </div>
  );
};

ProfileDescription.propTypes = {
  personName: PropTypes.string.isRequired,
  jobTitle: PropTypes.string.isRequired,
  location: PropTypes.string,
  qualifications: PropTypes.string,
};

export default ProfileDescription;
