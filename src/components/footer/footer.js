import React from 'react';
import preval from 'preval.macro';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { companyShortName, social } from '../../../site-config';
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
          <div>
            <div className="mx-2 md:mx-6 flex flex-col-reverse lg:flex-row justify-between">
              <div className="py-2">
                Copyright © {companyShortName} 1990 - {new Date().getFullYear()}
                . All Rights Reserved.
              </div>
              <div className="w-full lg:w-3/6 lg:text-right py-2">
                <a
                  className="footer-link"
                  href="https://github.com/SSWConsulting/SSW.People/issues"
                >
                  FEEDBACK TO {companyShortName}
                </a>
                <span className="px-2">|</span>
                <a
                  className="footer-link"
                  href="https://www.ssw.com.au/ssw/Standards/Forms/ConsultingOrderTermsConditions.aspx"
                >
                  TERMS AND CONDITIONS
                </a>
                <span className="px-2">|</span>
                <a className="footer-link footer-facebook" href={social.fbPage}>
                  FIND US ON
                </a>
                <span className="px-2">|</span>
                <a
                  className="footer-link footer-html"
                  href="https://www.w3.org/html/logo/faq.html"
                >
                  HTML
                </a>
              </div>
              {/* Copyright © SSW 1990 - {new Date().getFullYear()}. All Rights Reserved. */}
            </div>
            <hr className="border-gray-800 my-2"></hr>
            <div className="flex flex-col lg:flex-row justify-between mx-2 md:mx-6">
              <div className="py-2">
                Our website is under{' '}
                <a
                  className="footer-link"
                  href="https://rules.ssw.com.au/WebSites/RulestoBetterWebsites-Deployment/Pages/Do-your-developers-deploy-manually.aspx"
                >
                  CONSTANT CONTINUOUS DEPLOYMENT
                </a>
                . Last deployed {getLastDeployTime()} ago (Build #{' '}
                {process.env.VERSION_DEPLOYED})
              </div>
              <div className="lg:text-right py-2">
                <a
                  className="footer-link"
                  href="https://rules.ssw.com.au/rules-to-better-internationalization"
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
                  href="https://rules.ssw.com.au/rules-to-better-azure"
                >
                  Azure
                </a>{' '}
                and{' '}
                <a
                  className="footer-link"
                  href="https://rules.ssw.com.au/rules-to-better-github"
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
