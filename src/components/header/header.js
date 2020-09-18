import React from 'react';
import posed from 'react-pose';
import CompanyLogo from '-!svg-react-loader!../../images/branding/Logo.svg';
import CountrySelect from '../country-select/country-select';
import { parentSiteUrl } from '../../../site-config';

// Example of a component-specific page transition
const AnimatedContainer = posed.div({
  enter: {
    y: 0,
    transition: {
      ease: 'easeInOut',
    },
  },
  exit: {
    y: '-100%',
    transition: {
      ease: 'easeInOut',
    },
  },
});

const Header = () => {
  return (
    <AnimatedContainer>
      <header>
        <div className="flex mx-2 md:mx-6 mt-4 mb-6">
          <div className="flex items-center">
            <a href={parentSiteUrl} className="unstyled cursor-pointer">
              <CompanyLogo aria-label="logo" />
            </a>
            <h1 className="title ml-2">Our People</h1>
          </div>
          <div className="action-btn-container print-hidden">
            <CountrySelect />
          </div>
        </div>
      </header>
    </AnimatedContainer>
  );
};

Header.propTypes = {};

export default Header;
