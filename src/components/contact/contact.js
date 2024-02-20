import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ContactInfo from '../contact-info/contact-info';
import JotFormEmbed from '../jobform/jobFormEmbed.jsx';

const Contact = ({ firstNameOrNickname, fullName, alumni }) => {
  const [displayContactForm, setDisplayContactForm] = useState(false);

  const onContactButtonClick = () => {
    setDisplayContactForm(!displayContactForm);
  };
  return (
    <>
      <ContactInfo
        onClick={() => onContactButtonClick()}
        profileName={firstNameOrNickname}
        alumni={alumni}
      />
      <JotFormEmbed
        jotFormId="233468468973070"
        open={displayContactForm}
        onClose={onContactButtonClick}
      />
    </>
  );
};

Contact.propTypes = {
  firstNameOrNickname: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  alumni: PropTypes.bool.isRequired,
};

export default Contact;
