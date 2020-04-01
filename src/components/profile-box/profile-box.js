import React, { useState, useEffect } from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import PlayIcon from '-!svg-react-loader!../../images/SSWPlay2x.svg';
import PauseIcon from '-!svg-react-loader!../../images/SSWPause2x.svg';

const ProfileBox = ({
  profile,
  sanitisedName,
  profileImages,
  sanitisedNickname,
  profileAudio,
}) => {
  const [hover, setHover] = useState(false);
  const [hoverAudio, setHoverAudio] = useState(false);
  const tileName = profile.nickname
    ? profile.nickname
    : profile.name.split(' ')[0];
  const [audio, setAudio] = useState({});

  useEffect(() => {
    setAudio(new Audio());
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = srcAudio => {
    setIsPlaying(true);
    audio.src = srcAudio;
    audio.play();
  };
  const stopAudio = () => {
    setIsPlaying(false);
    audio.pause();
    audio.currentTime = 0;
  };

  audio.onended = () => {
    setIsPlaying(false);
  };

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
          hoverAudio
            ? 'absolute top-0 right-0 p-2 hovered'
            : 'absolute top-0 right-0 p-2 audio-div-dark-translucent'
        }
        onMouseEnter={() => {
          setHoverAudio(true);
        }}
        onMouseLeave={() => {
          setHoverAudio(false);
        }}
      >
        {!isPlaying && (
          <PlayIcon
            aria-label="play audio"
            className={'cursor-pointer h-3'}
            onClick={() => {
              playAudio(profileAudio);
            }}
          />
        )}
        {isPlaying && (
          <PauseIcon
            aria-label="pause audio"
            className={'cursor-pointer h-3'}
            onClick={() => {
              stopAudio();
            }}
          />
        )}
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
