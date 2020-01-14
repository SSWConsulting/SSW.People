/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../checkbox';
import {
	faCheck,
	faAngleUp,
	faAngleDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../style.css';

const SkillsFilter = ({ allSkills, selectedSkills, onSkillChange }) => {
	const [listOpen, setListOpen] = useState(false);

	const onSkillClicked = skill => {
		const previouslySelected = isSkillSelected(skill);
		if (previouslySelected) {
			onSkillChange(selectedSkills.filter(s => s !== skill));
		} else {
			onSkillChange([skill, ...selectedSkills]);
		}
	};

	const isSkillSelected = skill => {
		return selectedSkills.indexOf(skill) !== -1;
	};

	// return (
	// 	<>
	// 		<h4 className="font-bold" onClick={() => onSkillChange([])}>
	// 			Technologies
	// 		</h4>
	// 		<div className="filter-skills">
	// 			{allSkills.map((skill, i) => (
	// 				<div key={i} className="category">
	// 					<Checkbox
	// 						labelText={skill}
	// 						checkboxValue={skill}
	// 						isChecked={isSkillSelected(skill)}
	// 						onChange={() => onSkillClicked(skill)}
	// 						checkedIcon={faCheck}
	// 						checkedClassName="font-bold"
	// 						checkboxColor={isSkillSelected(skill) ? '#cc4141' : ''}
	// 					/>
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
						className="font-bold whitespace-no-wrap cursor-pointer"
						onClick={() => setListOpen(!listOpen)}
					>
						Technologies{' '}
						<FontAwesomeIcon icon={listOpen ? faAngleUp : faAngleDown} />
					</h4>
				</div>
				<div className="hidden sm:hidden lg:block">
					<h4 className="font-bold whitespace-no-wrap">Technologies</h4>
				</div>
				<ul
					className={
						listOpen ? 'filter-skills' : 'filter-skills hidden lg:inline'
					}
				>
					<li className="flex clear-filter" onClick={() => onSkillChange([])}>
						Clear filters
					</li>
					{allSkills.map((skill, i) => (
						<li key={i} className="category">
							<Checkbox
								labelText={skill}
								checkboxValue={skill}
								isChecked={isSkillSelected(skill)}
								onChange={() => onSkillClicked(skill)}
								checkedIcon={faCheck}
								checkedClassName="font-bold"
								checkboxColor={isSkillSelected(skill) ? '#cc4141' : ''}
							/>
						</li>
					))}
				</ul>
			</div>
		</>
	);
};

SkillsFilter.propTypes = {
	allSkills: PropTypes.array.isRequired,
	selectedSkills: PropTypes.array.isRequired,
	onSkillChange: PropTypes.func.isRequired,
};

export default SkillsFilter;
