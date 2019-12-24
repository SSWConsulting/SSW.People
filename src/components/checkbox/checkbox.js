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
	checkedClassName,
	unCheckedClassName,
	checkboxColor,
}) => {
	return (
		<label className={`cursor-pointer ${(isChecked ? checkedClassName : unCheckedClassName)}`}>
			<input
				type="checkbox"
				className="hidden"
				name={checkboxValue}
				checked={isChecked}
				onChange={onChange}
			/>
			<div className="inline-block w-4 mr-1">
				{isChecked || unCheckedIcon ? (
					<FontAwesomeIcon icon={isChecked ? checkedIcon : unCheckedIcon} color={checkboxColor} />
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
	checkboxColor: PropTypes.string,
	checkedClassName: PropTypes.string,
	unCheckedClassName: PropTypes.string,
};

export default Checkbox;
