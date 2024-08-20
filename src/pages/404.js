import React from 'react';
import '../404.css';

const NotFound = () => {
  return (
    <div className="main-container">
      <div className="not-found-page">
        <div className="not-found-grid">
          <h1 className="unselectable">404</h1>
          <div className="not-found-message">
            <h2 className="unselectable">
              <span>PAGE NOT FOUND</span> <br />
              Sorry, we couldn&apos;t find the page you were looking for.
            </h2>
          </div>
          <div className="not-found-greybox greybox">
            Visit <a href="https://www.ssw.com.au">SSW homepage</a> to find out
            how we can help you.
          </div>
          <div className="not-found-greybox greybox">
            Learn more about{' '}
            <a href="https://www.ssw.com.au/rules/404-useful-error-page">
              having a useful 404 error page.
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NotFound;
