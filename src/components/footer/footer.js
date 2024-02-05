import React from 'react';
import preval from 'preval.macro';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faGithub,
  faInstagram,
  faLinkedin,
  faTwitter,
  faTiktok,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import China from '../../images/china.png';

const buildTimestamp = preval`module.exports = new Date().getTime();`;

const Footer = () => {
  return (
    <>
      <div className="py-2 text-center bg-grey-translucent text-sm">
        <section className="main-container">
          We <FontAwesomeIcon icon={faHeart} className="text-ssw-red" /> open
          source. Fork this on{' '}
          <a
            className="action-button-label"
            href="https://github.com/SSWConsulting/SSW.People"
          >
            GitHub <FontAwesomeIcon icon={faGithub} />
          </a>{' '}
          and start using it for yourself.
        </section>
      </div>
      <footer className="bg-black py-6 md:py-4 lg:py-2">
        <section className="main-container">
          <div className="xl:mx-6">
            <div className="mx-6 flex flex-col-reverse md:flex-row justify-between align-middle leading-6">
              <div className="py-2">
                &copy; 1990-{new Date().getFullYear()} SSW. All rights reserved.
              </div>
              <div className="w-full md:w-3/6 md:text-right py-2">
                <a
                  className="footer-link"
                  href="https://github.com/SSWConsulting/SSW.People/issues"
                >
                  FEEDBACK / SUGGEST A FEATURE
                </a>
                <span className="px-2">|</span>
                <a
                  className="footer-link"
                  href="https://www.ssw.com.au/terms-and-conditions"
                >
                  TERMS AND CONDITIONS
                </a>
                <span className="px-2">|</span>
                <div className="inline-flex flex-row-reverse justify-end flex-nowrap">
                  <a
                    className="unstyled social-media-icon"
                    title="SSW on TikTok"
                    href="https://www.tiktok.com/@ssw_tv"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faTiktok} size="lg" />
                  </a>
                  <a
                    className="unstyled social-media-icon"
                    title="SSW on Twitter"
                    href="https://twitter.com/SSW_TV"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faTwitter} size="lg" />
                  </a>
                  <a
                    className="unstyled social-media-icon"
                    title="SSW on Instagram"
                    href="https://www.instagram.com/ssw_tv"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faInstagram} size="lg" />
                  </a>
                  <a
                    className="unstyled social-media-icon"
                    title="SSW on Facebook"
                    href="https://www.facebook.com/SSW.page"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faFacebook} size="lg" />
                  </a>
                  <a
                    className="unstyled social-media-icon"
                    title="SSW on LinkedIn"
                    href="https://www.linkedin.com/company/ssw/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faLinkedin} size="lg" />
                  </a>
                  <a
                    className="unstyled social-media-icon"
                    title="SSW on YouTube"
                    href="https://www.youtube.com/user/sswtechtalks/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faYoutube} size="lg" />
                  </a>
                </div>
              </div>
              {/* &copy; 1990-{new Date().getFullYear()} SSW. All rights reserved. */}
            </div>
            <hr className="border-gray-800 my-2"></hr>
            <div className="flex flex-col lg:flex-row justify-between mx-2 md:mx-6">
              <div className="py-2">
                This website is under{' '}
                <a
                  className="footer-link"
                  href="https://ssw.com.au/rules/do-you-continuously-deploy"
                >
                  CONSTANT CONTINUOUS DEPLOYMENT
                </a>
                . Last deployed {getLastDeployTime()} ago (Build #{' '}
                {process.env.VERSION_DEPLOYED})
              </div>
              <div className="py-2">
                <a
                  className="footer-link"
                  href="https://ssw.com.au/rules/rules-to-better-internationalization"
                >
                  Chinafied
                  <img
                    src={China}
                    alt="Chinese flag"
                    className="flag inline px-1"
                  />
                </a>
                <span className="px-2">|</span>
                Powered by{' '}
                <a
                  className="footer-link"
                  href="https://ssw.com.au/rules/rules-to-better-azure"
                >
                  Azure
                </a>{' '}
                and{' '}
                <a
                  className="footer-link"
                  href="https://ssw.com.au/rules/rules-to-better-github"
                >
                  {' '}
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </section>
      </footer>
    </>
  );
};

const getLastDeployTime = () => {
  const lastDeployDuration = moment.duration(Date.now() - buildTimestamp);
  let delta = Math.abs(lastDeployDuration) / 1000;

  const days = Math.floor(delta / 86400);
  delta -= days * 86400;

  var hours = Math.floor(delta / 3600) % 24;
  delta -= hours * 3600;

  var minutes = Math.floor(delta / 60) % 60;
  delta -= minutes * 60;

  return days != 0
    ? `${days} day(s)`
    : '' + ' ' + hours != 0
    ? `${hours} hour(s)`
    : '' + ' ' + minutes > 1
    ? `${minutes} minutes`
    : '1 minute';
};

Footer.propTypes = {};

export default Footer;
