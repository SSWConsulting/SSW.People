import React from 'react';
import PropTypes from 'prop-types';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import { buildCopyDetailsHtml } from '../../../helpers/copyDetailsHtml';

const CopyProfileInformation = ({
  fullName,
  jobTitle,
  slug,
  billingRate,
  profileImageSrc,
}) => {
  const copyHtmlToClipboard = () => {
    const siteUrl = window.location?.origin;
    const htmlToCopy = buildCopyDetailsHtml({
      fullName,
      jobTitle,
      slug,
      billingRate,
      imageUrl: siteUrl.concat(profileImageSrc),
    });

    copy(htmlToCopy, {
      format: 'text/html',
    });
    toast.success('Copied to clipboard');
  };

  return (
    <button
      onClick={copyHtmlToClipboard}
      title="Copy details"
      className="profile-util mb-4 ml-2 bottom-0 absolute profile-util-copy-left z-10 profile-util-copy"
    >
      <FontAwesomeIcon icon={faCopy} />
    </button>
  );
};

CopyProfileInformation.propTypes = {
  profileImageSrc: PropTypes.string,
  fullName: PropTypes.string.isRequired,
  jobTitle: PropTypes.string,
  slug: PropTypes.string.isRequired,
  billingRate: PropTypes.number.isRequired,
};

export default CopyProfileInformation;
