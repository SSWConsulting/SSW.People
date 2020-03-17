import React, { useState } from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';

const ProfileBox = ({ profile, sanitisedName, profileImages }) => {
  const [hover, setHover] = useState(false);

  const content = profileImages.profileImage !== undefined && (
    <div
      className="relative shadow-lg profile-image"
      style={{ height: '242px' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Img
        alt={`${profile.nickname} profile image`}
        fluid={
          hover ? profileImages.profileImage : profileImages.sketchProfileImage
        }
        style={{ position: 'static' }}
        fadeIn={false}
      />
      <div
        className={
          hover
            ? 'absolute inset-x-0 bottom-0 px-1 pb-4 pt-2 h-15 text-center hovered'
            : 'absolute inset-x-0 bottom-0 px-1 pb-4 pt-2 h-15 text-center'
        }
      >
        <div className="font-bold text-sm">{profile.nickname}</div>
        <div className="text-xs leading-none">{profile.role}</div>
      </div>
    </div>
  );

  return profile.role === 'enthusiastic People' ? (
    <a
      href="https://www.ssw.com.au/ssw/Employment/default.aspx"
      className="w-full flex-profile-box unstyled"
    >
      {content}
    </a>
  ) : (
    <Link
      to={`/${sanitisedName.toLowerCase()}`}
      className="w-full flex-profile-box unstyled"
    >
      {content}
    </Link>
  );
};

ProfileBox.propTypes = {
  profile: PropTypes.object.isRequired,
  sanitisedName: PropTypes.string.isRequired,
  profileImages: PropTypes.exact({
    profileImage: PropTypes.object,
    sketchProfileImage: PropTypes.object,
  }),
};

export default ProfileBox;
