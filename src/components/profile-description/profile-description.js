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
      <h4 className="mb-0">
        <span className="block md:inline">{jobTitle}</span>
        {location && (
          <span className="mb-0 block md:inline md:ml-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
            {location}
          </span>
        )}
      </h4>
      <p>{qualifications && <strong>{qualifications}</strong>}</p>
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
