import React from 'react';
import PropTypes from 'prop-types';
import '../../style.css';

const SplitOnUpperCase = (word) => {
	return word
		.replace(/([A-Z])/g, ' $1') // insert a space before all caps
		.replace(/^./, function(str){ return str.toUpperCase(); }); // uppercase the first character
};

const LocationFilter = ({ locations, selectedLocation, setLocation }) => (
	<div className="items-center flex">
		{locations.map((location, i) => {
			return (
				<button
					key={i}
					id={location}
					className={
						selectedLocation === location
							? 'filter-location-selected mr-12'
							: 'mr-12'
					}
					onClick={() => setLocation(location)}>
					{SplitOnUpperCase(location)}
				</button>
			);
		})}
	</div>
);

LocationFilter.propTypes = {
	locations: PropTypes.array.isRequired,
	selectedLocation: PropTypes.string.isRequired,
	setLocation: PropTypes.func.isRequired,
};

export default LocationFilter;
