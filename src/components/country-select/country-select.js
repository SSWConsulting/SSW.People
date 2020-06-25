import React, { useState } from 'react';
import Australia from '../../images/australia.png';
import China from '../../images/china.png';
import { isChinaBuild } from '../../helpers/chinaHelper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@reach/router';

const CountrySelect = ({ location }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div>
        <button onClick={() => setIsOpen(!isOpen)}>
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
          <FontAwesomeIcon icon={faAngleDown} />
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
              href={`https://ssw.com.au/people${location.pathname || ''}`}
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
              href={`https://ssw.com.au/people-cn${location.pathname || ''}`}
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

//export default CountrySelect;

const CountrySelectWithLocation = props => (
  <Location>{({ location }) => <CountrySelect location={location} />}</Location>
);

export default CountrySelectWithLocation;
