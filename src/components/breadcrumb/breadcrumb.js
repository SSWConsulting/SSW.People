import React from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'gatsby-plugin-breadcrumb';
import { parentSiteUrl } from '../../../site-config';
import Icon from '../../images/branding/icon.png';

const Breadcrumbs = ({ crumbs, crumbLabel }) => {
  return (
    <div className="breadcrumb-container print-hidden">
      <div className="mx-2 md:mx-6 mb-3 breadcrumb">
        <a href={parentSiteUrl}>
          <img alt={'SSW Consulting'} src={Icon} className="w-4" />
        </a>
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
};

export default Breadcrumbs;
