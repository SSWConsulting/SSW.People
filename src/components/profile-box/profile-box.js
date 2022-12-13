import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import PropTypes from 'prop-types';
import PlayAudio from '../play-audio/play-audio';
import SketchPlaceholder from '../../images/ssw-employee-profile-placeholder-sketch.jpg';
import ProfilePlaceholder from '../../images/ssw-employee-profile-placeholder-profile.jpg';

const ProfileBox = ({
  profile,
  sanitisedName,
  profileImages,
  sanitisedNickname,
  profileAudio,
}) => {
  const linkRef = useRef();
  const [hover, setHover] = useState(false);
  const tileName = profile.nickname
    ? profile.nickname
    : profile.fullName.split(' ')[0];

  const content = (
    <div className="relative shadow-lg profile-image profile-image-height">
      {profileImages.profileImage && (
        <GatsbyImage
          image={profileImages.profileImage}
          alt={`${profile.fullName} profile image`}
          style={{ position: 'static' }}
          className={!hover ? 'gatsby-image-hidden' : ''}
          loading="eager"
        />
      )}
      {!profileImages.profileImage && (
        <img
          src={ProfilePlaceholder}
          alt=""
          className={`${
            !hover ? 'gatsby-image-hidden' : ''
          } profile-placeholder`}
        ></img>
      )}

      {profileImages.sketchProfileImage && (
        <GatsbyImage
          image={profileImages.sketchProfileImage}
          alt={`${profile.fullName} profile image`}
          style={{ position: 'static' }}
          className={hover ? 'gatsby-image-hidden' : ''}
          loading="eager"
        />
      )}
      {!profileImages.sketchProfileImage && (
        <img
          src={SketchPlaceholder}
          alt={`${profile.fullName} profile`}
          className={`${
            hover ? 'gatsby-image-hidden' : ''
          } profile-placeholder`}
        ></img>
      )}
      <div
        className={
          hover
            ? 'absolute inset-x-0 bottom-0 px-1 pb-4 pt-2 h-15 text-center hovered'
            : 'absolute inset-x-0 bottom-0 px-1 pb-4 pt-2 h-15 text-center'
        }
      >
        <div className="font-bold text-sm">
          {hover ? profile.fullName : tileName}
        </div>
        <div className="text-xs leading-none">{profile.jobTitle}</div>
      </div>
    </div>
  );

  useEffect(() => {
    if (hover && linkRef.current && linkRef.current.matches(':hover') === false)
      setHover(false);
  });

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
      {profile.alternativeUrl ? (
        <a ref={linkRef} href={profile.alternativeUrl}>
          {content}
        </a>
      ) : (
        <Link
          ref={linkRef}
          to={`/${
            profile.nickname
              ? sanitisedNickname.toLowerCase()
              : sanitisedName.toLowerCase()
          }`}
        >
          {content}
        </Link>
      )}
      {profileAudio ? (
        <PlayAudio hasAnimation={false} audioSrc={profileAudio} />
      ) : (
        ''
      )}
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
