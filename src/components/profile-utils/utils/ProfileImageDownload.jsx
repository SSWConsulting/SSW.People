import React from 'react';
import PropTypes from 'prop-types';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ProfilePlaceholder from '../../../images/ssw-employee-profile-placeholder-profile.jpg';

const ProfileImageDownload = ({ profileImage }) => (
  <a
    className=" text-ssw-red hover:text-black  download-image absolute bottom-0  profile-util-download-left mb-4 z-10"
    href={profileImage ? profileImage.src : ProfilePlaceholder}
    download={profileImage?.name}
  >
    <div className="">
      <FontAwesomeIcon icon={faDownload} className="" />
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
