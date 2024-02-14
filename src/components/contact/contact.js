import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ContactInfo from '../contact-info/contact-info';
import ContactForm from '../contact-form/contact-form';
import Modal from 'react-modal';

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
      <Modal
        isOpen={displayContactForm}
        contentLabel="Contact Form"
        className="modal"
      >
        <ContactForm
          profileName={fullName}
          onClose={() => setDisplayContactForm(false)}
        />
      </Modal>
    </>
  );
};

Contact.propTypes = {
  firstNameOrNickname: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  alumni: PropTypes.bool.isRequired,
};

export default Contact;
