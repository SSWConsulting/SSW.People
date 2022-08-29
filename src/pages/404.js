import React from 'react';
import { navigate } from 'gatsby';

import '../404.css';

const NotFound = () => {
  return (
    <>
      <div className="main-container">
        <div className="not-found-page">
          <div className="not-found-grid">
            <h1 className="unselectable">404</h1>
            <div className="not-found-message">
              <h2 className="unselectable mt-2">
                <span>PAGE NOT FOUND!</span>
                <h2 className="unselectable -mt-4">
                  Sorry, we couldn&apos;t find the
                </h2>

                <h2 className="unselectable -mt-6">
                  page you were looking for...
                </h2>
              </h2>
            </div>
            <div className="not-found-greybox greybox">
              Visit <a href="https://www.ssw.com.au/ssw/">SSW homepage</a> to
              find out how we can help you.
            </div>
            <div className="not-found-greybox greybox">
              Learn more about{' '}
              <a href="https://ssw.com.au/rules/404-useful-error-page">
                having a useful 404 error page
              </a>
              .
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default NotFound;
