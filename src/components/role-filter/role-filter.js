import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import RoleSort from '../../helpers/roleSort';
import '../../style.css';

const RoleFilter = ({
	allRoles,
	selectedRoles,
	onRoleChange,
	filteredPeople,
}) => {
	const onRoleClicked = role => {
		const previouslySelected = isRoleSelected(role);
		if (previouslySelected) {
			onRoleChange(selectedRoles.filter(s => s !== role));
		} else {
			onRoleChange([role, ...selectedRoles]);
		}
	};

	const isRoleSelected = role => {
		return selectedRoles.indexOf(role) !== -1;
	};

	return (
		<div className="filter-role">
			{allRoles.sort(RoleSort).map(role => (
				<div key={role} className="flex">
					<div className="w-3/4">
						<label className="filter-checkbox">
							<input
								type="checkbox"
								name={role}
								checked={isRoleSelected(role)}
								onChange={() => onRoleClicked(role)}
							/>
							<FontAwesomeIcon
								icon={faCheckSquare}
								className="filter-checked"
							/>
							<FontAwesomeIcon icon={faSquare} className="filter-unchecked" />
							<span className="filter-text">{role}</span>
						</label>
					</div>
					<div className="w-1/4">{filteredPeople.filter(p => p.role === role).length}</div>
				</div>
			))}
		</div>
	);
};

RoleFilter.propTypes = {
	allRoles: PropTypes.array.isRequired,
	selectedRoles: PropTypes.array.isRequired,
	onRoleChange: PropTypes.func.isRequired,
	filteredPeople: PropTypes.array.isRequired,
};

export default RoleFilter;
