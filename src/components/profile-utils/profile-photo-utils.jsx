import React, { Fragment } from 'react';
import ProfileImageDownload from './utils/ProfileImageDownload';
import PropTypes from 'prop-types';
import CopyProfileInformation from './utils/CopyProfileInformation';

const ProfilePhotoUtils = ({ profile }) => {
  return (
    <Fragment>
      <ProfileImageDownload profileImage={profile?.profileImage} />
      <CopyProfileInformation
        billingRate={+profile.billingRate}
        profileImage={profile.profileImage}
        slug={profile.slug}
        fullName={profile.fullName}
      />
    </Fragment>
  );
};

ProfilePhotoUtils.propTypes = {
  profile: PropTypes.shape({
    profileImage: PropTypes.shape({
      src: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
    fullName: PropTypes.string.isRequired,
    billingRate: PropTypes.number.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfilePhotoUtils;
