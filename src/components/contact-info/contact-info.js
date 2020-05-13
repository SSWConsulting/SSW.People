import React from 'react';
import PropTypes from 'prop-types';

const ContactInfo = ({ onClick, profileName }) => {
  return (
    <div className="contact">
      <h3 className="text-ssw-red">
        Interested in what {profileName ? profileName : 'we'} can do for you?
      </h3>
      <p>
        Contact {profileName ? `${profileName}'s` : 'an'} Account Manager to
        discuss your project
      </p>
      <button className="btn btn-red" onClick={() => onClick()}>
        Book a Free Initial Meeting
      </button>
      <p>
        or call on <span className="font-semibold">+61 2 9953 3000</span>
      </p>
    </div>
  );
};

ContactInfo.propTypes = {
  profileName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ContactInfo;
