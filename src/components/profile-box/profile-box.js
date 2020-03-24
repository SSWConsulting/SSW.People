import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';

const ProfileBox = ({
  profile,
  sanitisedName,
  profileImages,
  sanitisedNickname,
  profileAudio,
}) => {
  const [hover, setHover] = useState(false);
  const tileName = profile.nickname
    ? profile.nickname
    : profile.name.split(' ')[0];
  const [audio, setAudio] = useState({});

  const playAudio = srcAudio => {
    audio.src = srcAudio;
    audio.load();
    audio.play();
  };
  const stopAudio = () => {
    audio.pause();
    audio.currentTime = 0;
  };
  useEffect(() => {
    setAudio(new Audio());
  }, []);
  const content = profileImages.profileImage !== undefined && (
    <div
      className="relative shadow-lg profile-image"
      style={{ height: '242px' }}
      onMouseEnter={() => {
        setHover(true);
        if (profileAudio) {
          playAudio(profileAudio);
        }
      }}
      onMouseLeave={() => {
        setHover(false);
        if (profileAudio) {
          stopAudio();
        }
      }}
    >
      <Img
        alt={`${profile.name} profile image`}
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
        <div className="font-bold text-sm">
          {hover ? profile.name : tileName}
        </div>
        <div className="text-xs leading-none">{profile.role}</div>
      </div>
    </div>
  );

  return profile.alternativeUrl ? (
    <a
      href={profile.alternativeUrl}
      className="w-full flex-profile-box unstyled"
    >
      {content}
    </a>
  ) : (
    <Link
      to={`/${
        profile.nickname
          ? sanitisedNickname.toLowerCase()
          : sanitisedName.toLowerCase()
      }`}
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
  sanitisedNickname: PropTypes.string,
  profileAudio: PropTypes.string,
};

export default ProfileBox;
