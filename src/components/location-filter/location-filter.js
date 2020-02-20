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
        l => l.toLowerCase() === location.toLowerCase()
      )[0];
      if (locationTxt && locationTxt !== selectedLocation) {
        onLocationChange(locationTxt);
      }
    }
  };

  const onLocationClicked = location => {
    onLocationChange(location);
    search.location = location;
    history.pushState(
      { search },
      'Location',
      '?' + queryString.stringify(search)
    );
  };

  initLocation();

  return (
    <div className="flex bg-ssw-grey text-black justify-center">
      <div className="flex flex-wrap justify-around location-filter">
        {locations.sort(LocationSort).map((location, i) => {
          return (
            <button
              key={i}
              id={location}
              className={`p-3 ${
                selectedLocation === location ? 'font-bold text-ssw-red' : ''
              }`}
              onClick={() => onLocationClicked(location)}
            >
              {location}
            </button>
          );
        })}
      </div>
    </div>
  );
};

LocationFilter.propTypes = {
  locations: PropTypes.array.isRequired,
  selectedLocation: PropTypes.string.isRequired,
  onLocationChange: PropTypes.func.isRequired,
};

export default withURLLocation(LocationFilter);
