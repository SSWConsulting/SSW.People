import React from 'react';
import PropTypes from 'prop-types';
import LocationSort from '../../helpers/locationSort';
import '../../style.css';
import withURLLocation from '../withLocation/withURLLocation';
import queryString from 'query-string';

const LocationFilter = ({
  locations,
  selectedLocation,
  onLocationChange,
  search,
}) => {
  const { location } = search;

  const initLocation = () => {
    if (location) {
      const locationTxt = locations.filter(
        (l) => l.toLowerCase() === location.toLowerCase()
      )[0];
      if (locationTxt && locationTxt !== selectedLocation) {
        onLocationChange(locationTxt);
      }
    }
  };

  const onLocationClicked = (location) => {
    onLocationChange(location);
    search.location = location;
    window.history.pushState(
      { search },
      'Location',
      '?' + queryString.stringify(search)
    );
  };

  initLocation();

  // One toggle button per city. aria-pressed marks the selected one, and
  // .btn-outline fills it red.
  return (
    <div role="group" aria-label="Location" className="flex flex-wrap gap-2">
      {locations.sort(LocationSort).map((location) => (
        <button
          key={location}
          id={location}
          type="button"
          aria-pressed={selectedLocation === location}
          className="btn-outline"
          onClick={() => onLocationClicked(location)}
        >
          {location}
        </button>
      ))}
    </div>
  );
};

LocationFilter.propTypes = {
  locations: PropTypes.array.isRequired,
  selectedLocation: PropTypes.string.isRequired,
  onLocationChange: PropTypes.func.isRequired,
  search: PropTypes.object,
};

export default withURLLocation(LocationFilter);
