import React from 'react';
import PropTypes from 'prop-types';

const ContactInfo = ({ onClick, profileName, alumni }) => {
  return (
    <div className="contact">
      <h3 className="text-ssw-red">
        Interested in what {profileName && !alumni ? profileName : 'we'} can do
        for you?
      </h3>
      <p>
        Contact {profileName && !alumni ? `${profileName}'s` : 'an SSW'} Account
        Manager to discuss your project
      </p>
      <button className="btn btn-red" onClick={() => onClick()}>
        Book a Free Initial Meeting
      </button>
      <p>
        or call on <a href="tel:+61299533000">+61 2 9953 3000</a>
      </p>
    </div>
  );
};

ContactInfo.propTypes = {
  profileName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  alumni: PropTypes.bool.isRequired,
};

export default ContactInfo;
