import React from 'react';
import PropTypes from 'prop-types';

const Contact = ({onClick, profileName,}) => {
  return (
    <div className="contact">
      <h3 className="text-ssw-red">
        Interested in what {profileName} can do for you?
      </h3>
      <p>
        Jump on a call with one of our Account Managers to discuss how we can
        help you.
      </p>
      <button className="btn" onClick={() => onClick()}>Book a Free Initial Meeting</button>
      <p>or call on +61 2 9953 3000</p>
    </div>
  );
};

Contact.propTypes = {
  profileName: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Contact;
