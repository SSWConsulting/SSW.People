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
                <span>PAGE NOT FOUND</span>
                <h2 className="unselectable -mt-4">
                  Sorry, we could not find the
                </h2>
                <h2 className="unselectable -mt-6">
                  page you were looking for
                </h2>
              </h2>
            </div>
            <div className="not-found-greybox greybox">
              Visit <a href="https://www.ssw.com.au/ssw/">SSW homepage</a> for
              details on our Services, Staff and more or
              <span> </span>
              <button onClick={() => navigate(-1)}>go back</button>
              <span> </span>to the previous page.
            </div>
            <div className="not-found-greybox greybox">
              This page is as per{' '}
              <a href="https://ssw.com.au/rules/404-useful-error-page">
                Do you replace the 404 error with a useful error page?
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default NotFound;
