import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SketchPlaceholder from '../../images/ssw-employee-profile-placeholder-sketch.jpg';
import ProfilePlaceholder from '../../images/ssw-employee-profile-placeholder-profile.jpg';

const ProfilePhoto = ({ profileImage, sketchImage }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="image-bg relative text-center"
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      <a
        className="download-image"
        href={profileImage ? profileImage.src : ProfilePlaceholder}
        download={profileImage?.name}
      >
        <img
          className="profile-image bg-cover mx-auto"
          src={
            hover
              ? sketchImage
                ? sketchImage.src
                : SketchPlaceholder
              : profileImage
              ? profileImage.src
              : ProfilePlaceholder
          }
          alt="Profile"
        />
        <div className="absolute bottom-0 left-0">
          <FontAwesomeIcon icon={faDownload} className="m-4" />
        </div>
      </a>
    </div>
  );
};

ProfilePhoto.propTypes = {
  profileImage: PropTypes.object.isRequired,
  sketchImage: PropTypes.object.isRequired,
};

export default ProfilePhoto;
