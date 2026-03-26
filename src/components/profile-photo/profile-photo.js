import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SketchPlaceholder from '../../images/ssw-employee-profile-placeholder-sketch.jpg';
import ProfilePlaceholder from '../../images/ssw-employee-profile-placeholder-profile.jpg';

const Image = ({ hover, profileImage, sketchImage }) => {
  const src = hover
    ? sketchImage
      ? sketchImage.src
      : SketchPlaceholder
    : profileImage
      ? profileImage.src
      : ProfilePlaceholder;

  return (
    <img className="profile-image p-2 mx-auto" src={src} alt="Profile" />
  );
};

Image.propTypes = {
  hover: PropTypes.bool.isRequired,
  profileImage: PropTypes.shape({
    src: PropTypes.string.isRequired,
    name: PropTypes.string,
  }).isRequired,
  sketchImage: PropTypes.shape({
    src: PropTypes.string.isRequired,
  }).isRequired,
};

const ProfilePhoto = ({ profileImage, sketchImage, children }) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="border mb-4 shadow-md relative text-center"
      role="gridcell"
      tabIndex="0"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Image
        hover={hover}
        profileImage={profileImage}
        sketchImage={sketchImage}
      />
      {children}
    </div>
  );
};

ProfilePhoto.propTypes = {
  profileImage: PropTypes.shape({
    src: PropTypes.string.isRequired,
    name: PropTypes.string,
  }).isRequired,
  sketchImage: PropTypes.shape({
    src: PropTypes.string.isRequired,
  }).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
};

export default ProfilePhoto;
