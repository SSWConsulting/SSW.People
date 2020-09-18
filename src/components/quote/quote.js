import React from 'react';
import PropTypes from 'prop-types';

const Quote = ({ quote, author }) => {
  return (
    <>
      <div className="quote-container m-auto">
        <div className="person-quote text-left">{quote}</div>
        <div className="person-quote-name text-right">{author}</div>
      </div>
    </>
  );
};

Quote.propTypes = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

export default Quote;
