/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../checkbox';
import {
	faCheck,
	faAngleDown,
	faAngleUp,
} from '@fortawesome/free-solid-svg-icons';
import RoleSort from '../../helpers/roleSort';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../style.css';

const RoleFilter = ({
	allRoles,
	selectedRoles,
	onRoleChange,
	filteredPeople,
}) => {
	const [listOpen, setListOpen] = useState(false);

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

	// return (
	// 	<>
	// 		<h4 className="font-bold" onClick={() => onRoleChange([])}>
	// 			Roles
	// 		</h4>
	// 		<div className="filter-role">
	// 			{allRoles.sort(RoleSort).map(role => (
	// 				<div key={role} className="flex category">
	// 					<div className="w-4/4">
	// 						<Checkbox
	// 							labelText={role}
	// 							checkboxValue={role}
	// 							isChecked={isRoleSelected(role)}
	// 							onChange={() => onRoleClicked(role)}
	// 							checkedIcon={faCheck}
	// 							checkedClassName="font-bold"
	// 							checkboxColor={isRoleSelected(role) ? '#cc4141' : ''}
	// 						/>{' '}
	// 						({filteredPeople.filter(p => p.role === role).length})
	// 					</div>
	// 				</div>
	// 			))}
	// 		</div>
	// 	</>
	// );

	return (
		<>
			<div>
				<div className="block sm:block lg:hidden">
					<h4
						className="font-bold whitespace-no-wrap"
						onClick={() => setListOpen(!listOpen)}
					>
						Roles <FontAwesomeIcon icon={listOpen ? faAngleUp : faAngleDown} />
					</h4>
				</div>
				<div className="hidden sm:hidden lg:block ">
					<h4 className="font-bold whitespace-no-wrap cursor-pointer">Roles</h4>
				</div>

				<ul
					className={listOpen ? 'filter-role' : 'filter-role hidden lg:inline'}
				>
					<li className="flex clear-filter" onClick={() => onRoleChange([])}>
						Clear filters
					</li>
					{allRoles.sort(RoleSort).map(role => (
						<li key={role} className="flex category">
							<div className="w-4/4 whitespace-no-wrap">
								<Checkbox
									labelText={role}
                  checkboxValue={role}
                  checkboxCount={filteredPeople.filter(p => p.role === role).length}
									isChecked={isRoleSelected(role)}
									onChange={() => onRoleClicked(role)}
									checkedIcon={faCheck}
									checkedClassName="font-bold"
									checkboxColor={isRoleSelected(role) ? '#cc4141' : ''}
								/>
							</div>
						</li>
					))}
				</ul>
			</div>

			<div className="filter-role"></div>
		</>
	);
};

RoleFilter.propTypes = {
	allRoles: PropTypes.array.isRequired,
	selectedRoles: PropTypes.array.isRequired,
	onRoleChange: PropTypes.func.isRequired,
	filteredPeople: PropTypes.array.isRequired,
};

export default RoleFilter;
