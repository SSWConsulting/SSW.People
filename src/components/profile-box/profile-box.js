import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';

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
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = srcAudio => {
    audio.src = srcAudio;
    audio.load();
    audio.play();
    setIsPlaying(
      audio.currentTime > 0 &&
        !audio.paused &&
        !audio.ended &&
        audio.readyState > 2
    );
  };
  const stopAudio = () => {
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
    }
  };
  useEffect(() => {
    setAudio(new Audio());
  }, []);
  const content = profileImages.profileImage !== undefined && (
    <div
      className="relative shadow-lg profile-image"
      style={{ height: '242px' }}
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

  const linkContext = profile.alternativeUrl ? (
    <a href={profile.alternativeUrl}>{content}</a>
  ) : (
    <Link
      to={`/${
        profile.nickname
          ? sanitisedNickname.toLowerCase()
          : sanitisedName.toLowerCase()
      }`}
    >
      {content}
    </Link>
  );

  return (
    <div
      className="w-full flex-profile-box unstyled relative"
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
    >
      {linkContext}
      <div
        style={profileAudio ? {} : { display: 'none' }}
        className={
          hover
            ? 'absolute top-0 right-0 p-1 hovered'
            : 'absolute top-0 right-0 p-1 bg-ssw-dark-grey'
        }
      >
        <FontAwesomeIcon
          icon={faVolumeUp}
          size="sm"
          className={'mr-1 ml-1 cursor-pointer'}
          onClick={() => {
            if (profileAudio) {
              stopAudio();
              playAudio(profileAudio);
            }
          }}
        />
      </div>
    </div>
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
