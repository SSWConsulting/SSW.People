import React from 'react';
import { Breadcrumb } from 'gatsby-plugin-breadcrumb';

const Breadcrumbs = ({crumbs, crumbLabel}) => {
  return (
    <div className="mx-6 mb-3 breadcrumb">
      <a href="https://ssw.com.au">SSW Consulting</a>
      <span> &gt; </span>
      <Breadcrumb
        crumbs={crumbs}
        crumbLabel={crumbLabel}
        crumbSeparator=" > "
      />
    </div>
  )
}

export default Breadcrumbs;
