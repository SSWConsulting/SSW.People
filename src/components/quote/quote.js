import React from 'react';
import PropTypes from 'prop-types';

const Quote = ({ quote, author }) => {
  return (
    <>
      <div className="quote-container m-auto">
        <div className="person-quote mr-2 text-left">{quote}</div>
        <div className="person-quote-name uppercase text-sm mt-2 mr-2 text-right">{author}</div>
      </div>
    </>
  );
};

Quote.propTypes = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

export default Quote;
