import React from 'react';
import PropTypes from 'prop-types';
import LocationSort from '../../helpers/locationSort';
import '../../style.css';

const LocationFilter = ({ locations, selectedLocation, onLocationChange }) => {

	return (
		<div className="items-center flex">
			{locations.sort(LocationSort).map((location, i) => {
				return (
					<button
						key={i}
						id={location}
						className={
							selectedLocation === location
								? 'filter-location-selected mr-12'
								: 'mr-12'
						}
						onClick={() => onLocationChange(location)}>
						{location}
					</button>
				);
			})}
		</div>
	);
}

LocationFilter.propTypes = {
	locations: PropTypes.array.isRequired,
	selectedLocation: PropTypes.string.isRequired,
	onLocationChange: PropTypes.func.isRequired,
};

export default LocationFilter;
