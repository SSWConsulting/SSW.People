/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../checkbox';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import '../../style.css';

const SkillsFilter = ({ allSkills, selectedSkills, onSkillChange }) => {
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

	return (
		<>
			<h4 className="font-bold" onClick={() => onSkillChange([])}>
				Technologies
			</h4>
			<div className="filter-skills">
				{allSkills.map((skill, i) => (
					<div key={i}>
						<Checkbox
							labelText={skill}
							checkboxValue={skill}
							isChecked={isSkillSelected(skill)}
							onChange={() => onSkillClicked(skill)}
							checkedIcon={faCheck}
							checkedClassName="font-bold"
							checkboxColor={isSkillSelected(skill) ? '#cc4141' : ''}
						/>
					</div>
				))}
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
