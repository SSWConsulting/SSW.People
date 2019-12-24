import React from 'react';
import PropTypes from 'prop-types';
import LocationSort from '../../helpers/locationSort';
import '../../style.css';

const LocationFilter = ({ locations, selectedLocation, onLocationChange }) => {
	return (
		<div className="flex bg-gray-800 text-white">
			<div className="w-1/3"></div>

			<div className="w-1/3">
				<div className="flex justify-around">
					{locations.sort(LocationSort).map((location, i) => {
						return (
							<button
								key={i}
								id={location}
								className={`p-3 ${selectedLocation === location ? 'text-gray-800 bg-white font-bold' : ''}`}
								onClick={() => onLocationChange(location)}
							>
								{location}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
};

LocationFilter.propTypes = {
	locations: PropTypes.array.isRequired,
	selectedLocation: PropTypes.string.isRequired,
	onLocationChange: PropTypes.func.isRequired,
};

export default LocationFilter;
