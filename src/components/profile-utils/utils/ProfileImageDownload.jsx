import React from 'react';
import PropTypes from 'prop-types';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProfilePlaceholder from '../../../images/ssw-employee-profile-placeholder-profile.jpg';

const ProfileImageDownload = ({ profileImage }) => (
  <a
    className="download-image"
    href={profileImage ? profileImage.src : ProfilePlaceholder}
    download={profileImage?.name}
  >
    <div className="absolute bottom-0 left-0 mb-4 ml-4 z-10">
      <FontAwesomeIcon icon={faDownload} className="m-4" />
    </div>
  </a>
);

ProfileImageDownload.propTypes = {
  profileImage: PropTypes.shape({
    src: PropTypes.string.isRequired,
    name: PropTypes.string,
  }).isRequired,
};

export default ProfileImageDownload;
