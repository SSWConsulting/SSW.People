import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'gatsby-plugin-breadcrumb';

const Breadcrumbs = ({ crumbs, crumbLabel, locationOrigin }) => {
  return (
    <div className="breadcrumb-container">
      <div className="mx-6 mb-3 breadcrumb">
        <a href={locationOrigin}>SSW Consulting</a>
        <span> &gt; </span>
        <Breadcrumb
          crumbs={crumbs}
          crumbLabel={crumbLabel}
          crumbSeparator=" > "
        />
      </div>
    </div>
  );
};

Breadcrumbs.propTypes = {
  crumbs: PropTypes.array,
  crumbLabel: PropTypes.string,
  locationOrigin: PropTypes.string.isRequired,
};

export default Breadcrumbs;
