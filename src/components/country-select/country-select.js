import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Australia from '../../images/australia.png';
import China from '../../images/china.png';
import { isChinaBuild } from '../../helpers/chinaHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@reach/router';
import { siteUrl, siteUrlCn } from '../../../site-config';

const CountrySelect = ({ location }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div>
        <button onClick={() => setIsOpen(!isOpen)} className="country-select">
          {isChinaBuild && (
            <>
              <img src={China} alt="Chinese flag" className="inline pr-1" />
              简体中文
            </>
          )}
          {!isChinaBuild && (
            <>
              <img src={Australia} alt="Aussie flag" className="inline pr-1" />
              English
            </>
          )}
          <FontAwesomeIcon icon={faAngleDown} className="pl-1" />
        </button>
        <ul
          className={
            isOpen
              ? 'flags mr-1 border border-ssw-grey absolute bg-white z-50'
              : 'flags hidden'
          }
        >
          <li>
            <a
              href={`${siteUrl}${location.pathname.replace(
                '/people-cn/',
                '/people/'
              ) || ''}`}
              className="unstyled"
            >
              <img src={Australia} alt="Aussie flag" className="inline pr-1" />
              English
              {!isChinaBuild && (
                <FontAwesomeIcon icon={faCheck} className="text-ssw-red pl-1" />
              )}
            </a>
          </li>
          <li>
            <a
              href={`${siteUrlCn}${location.pathname.replace(
                '/people/',
                '/people-cn/'
              ) || ''}`}
              className="unstyled"
            >
              <img src={China} alt="Chinese flag" className="inline pr-1" />
              简体中文
              {isChinaBuild && (
                <FontAwesomeIcon icon={faCheck} className="text-ssw-red pl-1" />
              )}
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};

CountrySelect.propTypes = {
  location: PropTypes.object,
};

const CountrySelectWithLocation = props => (
  <Location>
    {({ location }) => <CountrySelect {...props} location={location} />}
  </Location>
);

export default CountrySelectWithLocation;
