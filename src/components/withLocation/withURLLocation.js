import React from 'react';
import { Location } from '@reach/router';
import queryString from 'query-string';

let search = location.search ? queryString.parse(location.search) : {};

const withURLLocation = ComponentToWrap => props => (
  <Location>
    {({ location, navigate }) => (
      <ComponentToWrap
        {...props}
        location={location}
        navigate={navigate}
        search={search}
      />
    )}
  </Location>
);

export default withURLLocation;
