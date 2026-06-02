import React from 'react';
import preval from 'preval.macro';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import GitHubButton from 'react-github-btn';
import {
  faFacebook,
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
      <div className="p-4 text-center bg-grey-translucent text-sm">
        <section className="main-container flex items-center justify-center gap-2	flex-wrap">
          <span>
            We <FontAwesomeIcon icon={faHeart} className="text-ssw-red" /> open
            source.
          </span>
          <span>
            Loving SSW People?{' '}
            <a
              href="https://github.com/SSWConsulting/SSW.People"
              target="_blank"
              rel="noreferrer"
              className="action-button-label footer-greybar-link"
            >
              Star us on GitHub.
            </a>{' '}
          </span>
          <GitHubButton
            href="https://github.com/SSWConsulting/SSW.People"
            data-size="large"
            data-show-count="true"
            aria-label="Star SSWConsulting/SSW.People on GitHub"
          >
            Star
          </GitHubButton>
        </section>
        <section className="main-container flex items-center justify-center mt-4">
          <span>
            Stand by... we&apos;re migrating this site to{' '}
            <a
              className="action-button-label footer-greybar-link"
              href="https://tina.io"
            >
              TinaCMS
            </a>.
          </span>
        </section>
      </div>
      <footer className="bg-black text-center px-4 py-6 md:py-4 lg:py-2">
        <section className="main-container">
          <div className="xl:mx-6">
            <div className="mx-6 flex flex-col-reverse md:flex-row justify-between align-middle leading-6">
              <div className="py-2">
                &copy; 1990-{new Date().getFullYear()} SSW. All rights reserved.
              </div>
              <div className="w-full md:w-3/4 md:text-right py-2">
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
                    aria-label="SSW on TikTok"
                  >
                    <FontAwesomeIcon icon={faTiktok} size="lg" />
                  </a>
                  <a
                    className="unstyled social-media-icon"
                    title="SSW on X (Twitter)"
                    href="https://x.com/SSW_TV"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="SSW on X (Twitter)"
                  >
                    <FontAwesomeIcon icon={faTwitter} size="lg" />
                  </a>
                  <a
                    className="unstyled social-media-icon"
                    title="SSW on Instagram"
                    href="https://www.instagram.com/ssw_tv"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="SSW on Instagram"
                  >
                    <FontAwesomeIcon icon={faInstagram} size="lg" />
                  </a>
                  <a
                    className="unstyled social-media-icon"
                    title="SSW on Facebook"
                    href="https://www.facebook.com/SSW.page"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="SSW on Facebook"
                  >
                    <FontAwesomeIcon icon={faFacebook} size="lg" />
                  </a>
                  <a
                    className="unstyled social-media-icon"
                    title="SSW on LinkedIn"
                    href="https://www.linkedin.com/company/ssw/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="SSW on LinkedIn"
                  >
                    <FontAwesomeIcon icon={faLinkedin} size="lg" />
                  </a>
                  <a
                    className="unstyled social-media-icon"
                    title="SSW on YouTube"
                    href="https://www.youtube.com/user/sswtechtalks/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="SSW on YouTube"
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
                  className="text-white hover:text-ssw-red transition-colors"
                  href="https://www.ssw.com.au/rules/rules-to-better-websites-deployment"
                >
                  continuous deployment
                </a>
                . Last updated{' '}
                <span
                  className="group relative inline-block cursor-help text-white hover:text-ssw-red transition-colors"
                  title={`Last updated ${moment(buildTimestamp).utc().format('D MMM YYYY [at] HH:mm UTC')}`}
                >
                  {getLastDeployTime()} ago
                  <span
                    role="tooltip"
                    className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 px-2 py-1 bg-white text-gray-900 text-xs leading-none rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-md z-10"
                  >
                    Last updated {moment(buildTimestamp).utc().format('D MMM YYYY [at] HH:mm UTC')}
                  </span>
                </span>
                {process.env.COMMIT_HASH && (
                  <>
                    . Last commit{' '}
                    <a
                      className="text-white hover:text-ssw-red transition-colors"
                      href={`https://github.com/SSWConsulting/SSW.People/commit/${process.env.COMMIT_HASH}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {process.env.COMMIT_HASH.slice(0, 7)}
                    </a>
                  </>
                )}
              </div>
              <div className="py-2">
                <a
                  className="footer-link"
                  href="https://www.ssw.com.au/rules/rules-to-better-internationalization"
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
                  href="https://www.ssw.com.au/rules/rules-to-better-azure"
                >
                  Azure
                </a>{' '}
                and{' '}
                <a
                  className="footer-link"
                  href="https://www.ssw.com.au/rules/rules-to-better-github"
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

  return days !== 0
    ? `${days} day(s)`
    : ' ' + hours !== 0
      ? `${hours} hour(s)`
      : ' ' + minutes > 1
        ? `${minutes} minutes`
        : '1 minute';
};

Footer.propTypes = {};

export default Footer;
