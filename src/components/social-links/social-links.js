import React from 'react';
import PropTypes from 'prop-types';

const SocialLinks = ({ crmData }) => {
  let encodedEmailAddress = '';

  const encodeEmail = emailAddress => {
    let encodedString = '';

    for (var i = 0; i < emailAddress.length; i++) {
      encodedString += emailAddress.charCodeAt(i).toString(16);
    }
    return encodedString;
  };

  const decodeEmail = encodedEmail => {
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

  const sendEmail = e => {
    e.preventDefault();
    window.location.href = 'mailTo:' + decodeEmail(encodedEmailAddress);
  };

  return (
    <>
      {crmData && (
        <div className="favor-content w-full">
          <ul className="favor-list">
            {crmData.emailAddress && (
              <li id="email" className="social">
                <a
                  href={'#0'}
                  onClick={event => {
                    sendEmail(event);
                  }}
                >
                  {' '}
                  Email{' '}
                </a>
              </li>
            )}
            {crmData.blogUrl && (
              <li id="blog" className="social">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={crmData.blogUrl}
                >
                  Blog
                </a>
              </li>
            )}
            {crmData.facebookUrl && (
              <li id="facebook" className="social">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={crmData.facebookUrl}
                >
                  Facebook
                </a>
              </li>
            )}
            {crmData.skypeUsername && (
              <li id="skype" className="social">
                <a href={`skype:${crmData.skypeUsername}?call`}>Skype</a>
              </li>
            )}
            {crmData.linkedInUrl && (
              <li id="linkedin" className="social">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={crmData.linkedInUrl}
                >
                  LinkedIn
                </a>
              </li>
            )}
            {crmData.twitterUsername && (
              <li id="twitter" className="social">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.twitter.com/${crmData.twitterUsername}`}
                >
                  Twitter
                </a>
              </li>
            )}
            {crmData.gitHubUrl && (
              <li id="github" className="social">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={crmData.gitHubUrl}
                >
                  GitHub
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
};

export default SocialLinks;
