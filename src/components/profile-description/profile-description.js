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
      <div className="flex items-center justify-between">
        <h1>{personName}</h1>
        {!isActive && (
          <div class="flex flex-grow flex-wrap gap-2 sm:flex-grow-0 ml-3">
            <div class="flex h-12 w-full shrink-0 items-center justify-center rounded-lg bg-ssw-red px-5 text-xl max-sm:my-5 sm:w-fit">
              <span class="flex items-center text-sm font-bold text-white">
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

        {children}
      </div>
      <h4 className="mb-0">
        <span className="block md:inline">{jobTitle}</span>
        {location && (
          <span className="mb-0 block md:inline md:ml-2">
            <FontAwesomeIcon
              icon={faMapMarkerAlt}
              className="mr-2"
              fontSize={16}
            />
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
  children: PropTypes.arrayOf(PropTypes.element),
};

export default ProfileDescription;
