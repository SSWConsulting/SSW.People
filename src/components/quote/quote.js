import React from 'react';
import PropTypes from 'prop-types';

const Quote = ({ quote, author }) => {
  return (
    <>
      <div className="person-quote">{quote}</div>
      <div className="person-quote-name">{author}</div>
    </>
  );
};

Quote.propTypes = {
  quote: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

export default Quote;
