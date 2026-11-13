import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faNewspaper,
  faImages,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faLinkedin,
  faXTwitter,
  faGithub,
} from '@fortawesome/free-brands-svg-icons';

const SocialLinks = ({ crmData, alumni }) => {
  let encodedEmailAddress = '';

  const encodeEmail = (emailAddress) => {
    let encodedString = '';

    for (var i = 0; i < emailAddress.length; i++) {
      encodedString += emailAddress.charCodeAt(i).toString(16);
    }
    return encodedString;
  };

  const decodeEmail = (encodedEmail) => {
    let email = '';

    if (encodedEmail !== undefined) {
      // go through and decode the email address
      for (var i = 0; i < encodedEmail.length; i += 2) {
        // holds each letter (2 digits)
        const letter = encodedEmail.charAt(i) + encodedEmail.charAt(i + 1);

        // build the real email address
        email += String.fromCharCode(parseInt(letter, 16));
      }
    }
    return email;
  };

  if (crmData) {
    encodedEmailAddress = encodeEmail(crmData.emailAddress);
  }

  const sendEmail = (e) => {
    e.preventDefault();
    const decodedEmail = decodeEmail(encodedEmailAddress);
    window.location.href = `mailTo:${decodedEmail}?subject=Contacting ${crmData.fullName} via SSW.People profile`;
  };

  if (!crmData) {
    return <></>;
  }

  if (alumni) {
    crmData.emailAddress = '';
  }

  // Shown in this order, after Email. Links without a URL are skipped.
  const links = [
    { label: 'Blog', icon: faNewspaper, url: crmData.blogUrl },
    { label: 'Photos', icon: faImages, url: crmData.publicPhotoAlbumUrl },
    { label: 'GitHub', icon: faGithub, url: crmData.gitHubUrl },
    { label: 'LinkedIn', icon: faLinkedin, url: crmData.linkedInUrl },
    {
      label: 'X (Twitter)',
      icon: faXTwitter,
      url:
        crmData.twitterUsername &&
        `https://www.twitter.com/${crmData.twitterUsername}`,
    },
    { label: 'Facebook', icon: faFacebook, url: crmData.facebookUrl },
  ].filter((link) => link.url);

  if (!crmData.emailAddress && !links.length) {
    return <></>;
  }

  // Same card as the Latest Rules widget, which matches the SSW Rules site.
  return (
    <div className="md:my-4 p-4 w-full bg-white border border-[#cfcfcf] rounded-md print-hidden">
      <ul className="favor-list m-0">
        {crmData.emailAddress && (
          <li className="social flex items-center">
            <FontAwesomeIcon icon={faEnvelope} className="mr-1" />
            <a
              href={'#0'}
              onClick={(event) => {
                sendEmail(event);
              }}
            >
              <span>Email </span>
            </a>
            <a
              href="https://github.com/SSWConsulting/SSW.People/wiki/4.-Extras#4-mailto-link-configure-your-default-mail-client"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs whitespace-nowrap cursor-pointer ml-2"
            >
              Having issues?
            </a>
          </li>
        )}
        {links.map(({ label, icon, url }) => (
          <li key={label} className="social">
            <a target="_blank" rel="noopener noreferrer" href={url}>
              <FontAwesomeIcon icon={icon} className="mr-1" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

SocialLinks.propTypes = {
  crmData: PropTypes.object.isRequired,
  alumni: PropTypes.bool.isRequired,
};

export default SocialLinks;
