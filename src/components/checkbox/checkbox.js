import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../style.css';

const Checkbox = ({
	labelText,
	checkboxValue,
	isChecked,
	onChange,
	checkedIcon,
	unCheckedIcon,
}) => {
	return (
		<label className="cursor-pointer">
			<input
				type="checkbox"
				className="hidden"
				name={checkboxValue}
				checked={isChecked}
				onChange={onChange}
			/>
			<div className="inline-block w-4 mr-1">
				{isChecked || unCheckedIcon ? (
					<FontAwesomeIcon icon={isChecked ? checkedIcon : unCheckedIcon} />
				) : (
					<></>
				)}
			</div>
			{labelText}
		</label>
	);
};

Checkbox.propTypes = {
	labelText: PropTypes.string.isRequired,
	checkboxValue: PropTypes.string.isRequired,
	isChecked: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
	checkedIcon: PropTypes.object.isRequired,
	unCheckedIcon: PropTypes.object,
};

export default Checkbox;
