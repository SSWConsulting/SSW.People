import React from 'react';
import { Location } from '@reach/router';
import queryString from 'query-string';

let search = Location.search ? queryString.parse(Location.search) : {};

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
