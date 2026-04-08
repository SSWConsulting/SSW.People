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
  faSkype,
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

  const displayCrm =
    crmData.emailAddress ||
    crmData.blogUrl ||
    crmData.facebookUrl ||
    crmData.linkedInUrl ||
    crmData.twitterUsername ||
    crmData.gitHubUrl ||
    crmData.publicPhotoAlbumUrl;

  return (
    <>
      {displayCrm && (
        <div className="favor-content border md:my-4 p-2 rounded w-full print-hidden">
          <ul className="favor-list mx-4 my-2">
            {crmData.emailAddress && (
              <>
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
                    className="text-xs whitespace-nowrap cursor-pointer italic ml-2"
                  >
                    Need help?
                  </a>
                </li>
              </>
            )}
            {crmData.blogUrl && (
              <li className="social">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={crmData.blogUrl}
                >
                  <FontAwesomeIcon icon={faNewspaper} className="mr-1" />
                  Blog
                </a>
              </li>
            )}
            {crmData.facebookUrl && (
              <li className="social">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={crmData.facebookUrl}
                >
                  <FontAwesomeIcon icon={faFacebook} className="mr-1" />
                  Facebook
                </a>
              </li>
            )}
            {crmData.linkedInUrl && (
              <li className="social">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={crmData.linkedInUrl}
                >
                  <FontAwesomeIcon icon={faLinkedin} className="mr-1" />
                  LinkedIn
                </a>
              </li>
            )}
            {crmData.twitterUsername && (
              <li className="social">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.twitter.com/${crmData.twitterUsername}`}
                >
                  <FontAwesomeIcon icon={faXTwitter} className="mr-1" />
                  X (Twitter)
                </a>
              </li>
            )}
            {crmData.gitHubUrl && (
              <li className="social">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={crmData.gitHubUrl}
                >
                  <FontAwesomeIcon icon={faGithub} className="mr-1" />
                  GitHub
                </a>
              </li>
            )}
            {crmData.publicPhotoAlbumUrl && (
              <li className="social">
                <a
                  href={crmData.publicPhotoAlbumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FontAwesomeIcon icon={faImages} className="mr-1" />
                  Photos
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

SocialLinks.propTypes = {
  crmData: PropTypes.object.isRequired,
  alumni: PropTypes.bool.isRequired,
};

export default SocialLinks;
