import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../style.css';

const Checkbox = ({
  labelText,
  checkboxValue,
  checkboxCount,
  isChecked,
  onChange,
  checkedIcon,
  unCheckedIcon,
  checkedClassName,
  unCheckedClassName = '',
  checkboxColor,
}) => {
  return (
    // As per https://bobbyhadz.com/blog/form-label-must-be-associated-with-control#eslint-a-form-label-must-be-associated-with-a-control
    // this should be fine. However, eslint still complains.
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      className={`cursor-pointer w-full ${
        isChecked ? checkedClassName : unCheckedClassName
      }`}
    >
      <input
        type="checkbox"
        className="hidden"
        name={checkboxValue}
        checked={isChecked}
        onChange={onChange}
      />
      <div className="flex">
        <div
          className={
            'inline-block w-4 mr-1' +
            (isChecked || unCheckedIcon ? '' : ' invisible')
          }
        >
          <FontAwesomeIcon icon={checkedIcon} color={checkboxColor} />
        </div>
        <div className="inline-block">
          {labelText} {checkboxCount != null ? ' (' + checkboxCount + ')' : ''}
        </div>
      </div>
    </label>
  );
};

Checkbox.propTypes = {
  labelText: PropTypes.string.isRequired,
  checkboxValue: PropTypes.string.isRequired,
  checkboxCount: PropTypes.number,
  isChecked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  checkedIcon: PropTypes.object.isRequired,
  unCheckedIcon: PropTypes.object,
  checkboxColor: PropTypes.string,
  checkedClassName: PropTypes.string,
  unCheckedClassName: PropTypes.string,
};

export default Checkbox;
