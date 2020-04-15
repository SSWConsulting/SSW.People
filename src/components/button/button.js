import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../style.css';

const Button = ({
  labelText,
  isActive,
  onClick,
  activeIcon,
  inActiveIcon,
  activeClassName,
  inActiveClassName,
}) => {
  return (
    <button
      className={isActive ? activeClassName : inActiveClassName}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={isActive ? activeIcon : inActiveIcon} /> {labelText}
    </button>
  );
};

Button.propTypes = {
  labelText: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  activeIcon: PropTypes.object.isRequired,
  inActiveIcon: PropTypes.object,
  activeClassName: PropTypes.string,
  inActiveClassName: PropTypes.string,
};

export default Button;
