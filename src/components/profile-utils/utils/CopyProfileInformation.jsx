import React from 'react';
import PropTypes from 'prop-types';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';

const CopyProfileInformation = ({
  fullName,
  slug,
  billingRate,
  profileImage,
}) => {
  const copyHtmlToClipboard = async () => {
    const PREPAID_DISCOUNT = 15;
    const siteUrl = location?.href.split(slug)[0];
    const imageUrl = siteUrl.concat(profileImage.src);

    const htmlToCopy = `
    <table border="0" cellspacing="0" cellpadding="0" style="width: auto;">
      <tr>
        <td>
          <img src="${imageUrl}" alt="${fullName}'s profile picture" height="90">
        </td>
        <td style="vertical-align: top; padding-left: 5px;"> <!-- Adjusted padding-left here -->
          <strong style="display: block; margin-bottom: 0;">${fullName}</strong>
          <ul style="margin-top: 0; padding-left: 20px; padding-top: 0;">
            <li style="margin-top: 0;">Profile: <a href="https://ssw.com.au/people/${slug}">https://ssw.com.au/people/${slug}</a></li>
            <li>Standard Hourly Rate: $${billingRate}+GST</li>
            <li>Prepaid Hourly Rate: $${
              billingRate - PREPAID_DISCOUNT
            }+GST (minimum 40 hours per resource, subject to prepaid terms)</li>
          </ul>
        </td>
      </tr>
    </table>
  `;

    copy(htmlToCopy, {
      format: 'text/html',
      debug: true,
    });
    toast.success('Copied to clipboard');
  };

  return (
    <button
      onClick={copyHtmlToClipboard}
      className="mb-4 bottom-0 absolute profile-util-copy-left z-10 profile-util-copy"
    >
      <FontAwesomeIcon icon={faCopy} />
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
