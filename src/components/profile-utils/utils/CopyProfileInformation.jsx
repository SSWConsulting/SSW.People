import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import copy from 'copy-to-clipboard';

const CopyProfileInformation = ({
  fullName,
  slug,
  billingRate,
  profileImage,
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copiedProfile = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 500);
  };

  const copyHtmlToClipboard = async () => {
    const response = await fetch(profileImage.src);
    const blob = await response.blob();
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64data = reader.result;

      const htmlToCopy = `
        <img src="${base64data}" alt="${fullName}'s profile picture"><br>
        <strong>${fullName}</strong><br>
        Profile: https://ssw.com.au/people/${slug}<br>
        Standard Hourly Rate: $${billingRate}+GST<br>
        Prepaid Hourly Rate: $${
          billingRate - 10
        }+GST (minimum 40 hours per resource, subject to prepaid terms)
      `;
      try {
        copy(htmlToCopy, {
          format: 'text/html',
          debug: true,
        });
        copiedProfile();
      } catch (e) {
        console.error(e);
      }
    };

    reader.readAsDataURL(blob);
  };

  return (
    <button
      onClick={copyHtmlToClipboard}
      className="mb-4 bottom-0 absolute profile-util-copy-left z-10"
    >
      <FontAwesomeIcon
        icon={faCopy}
        className={isCopied ? 'text-ssw-red' : ''}
      />
    </button>
  );
};

CopyProfileInformation.propTypes = {
  profileImage: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  billingRate: PropTypes.number.isRequired,
};

export default CopyProfileInformation;
