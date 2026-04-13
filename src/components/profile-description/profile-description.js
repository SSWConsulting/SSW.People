import React from 'react';
import PropTypes from 'prop-types';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxArchive } from '@fortawesome/free-solid-svg-icons';

const ProfileDescription = ({
  personName,
  jobTitle,
  location,
  qualifications,
  children,
  isActive,
}) => {
  return (
    <div>
      {!isActive && (
          <div className="mb-2">
            <div className="flex h-10 shrink-0 items-center justify-center rounded-lg bg-ssw-grey px-4 text-xl max-sm:my-4">
              <span className="flex items-center text-sm font-bold text-ssw-red">
                <FontAwesomeIcon
                  icon={faBoxArchive}
                  className="mr-2"
                  fontSize={16}
                />
                ALUMNI
              </span>
            </div>
          </div>
      )}
      <div className="flex sm:flex-row justify-between">
        <h1 className="mr-4">{personName}</h1>
        {children}
      </div>
      <h4>
        <span>{jobTitle}</span>
        {location && (
          <span className="block mb-2 sm:inline sm:mb-0 sm:ml-4">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="mr-1"
              fontSize={16}
            />
            {location}
          </span>
        )}
      </h4>
      <p className="my-2">{qualifications && <strong>{qualifications}</strong>}</p>
    </div>
  );
};

ProfileDescription.propTypes = {
  personName: PropTypes.string.isRequired,
  jobTitle: PropTypes.string.isRequired,
  location: PropTypes.string,
  qualifications: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  isActive: PropTypes.bool,
};

export default ProfileDescription;
