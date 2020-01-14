import React, { useState } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';

const ProfileBox = ({ profile, sanitisedName, profileImages }) => {
  const [hover, setHover] = useState(false);


  const content = profileImages.profileImage !== undefined && (
    <div
      className="relative bg-cover shadow-lg profile-image"
      style={{
        backgroundImage: `url(${
          hover
            ? profileImages.profileImage
            : profileImages.sketchProfileImage
        })`,
        height: '242px',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
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

  return (profile.role === "enthusiastic People" ?
    <a
      href='https://www.ssw.com.au/ssw/Employment/default.aspx'
      className='w-full flex-profile-box unstyled' >
      {content}
    </a>
    :
		<Link
			to={`/${sanitisedName}`}
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
		profileImage: PropTypes.string,
		sketchProfileImage: PropTypes.string,
	}),
};

export default ProfileBox;
