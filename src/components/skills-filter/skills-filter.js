
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSquare } from '@fortawesome/free-solid-svg-icons';
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
			<h4 className="filter-title" onClick={() => onSkillChange([])}>
				Technologies
			</h4>
			<div className="filter-skills">
				{allSkills.map((skill, i) => (
					<div key={i}>
						<label className="filter-checkbox">
							<input
								type="checkbox"
								name={skill}
								checked={isSkillSelected(skill)}
								onChange={() => onSkillClicked(skill)}
							/>
							<FontAwesomeIcon
								icon={faSquare}
								className="filter-unchecked-hide"
							/>
							<FontAwesomeIcon icon={faCheck} className="filter-checked-tick" />
							<span
								className={
									isSkillSelected(skill)
										? 'filter-text-checked'
										: 'filter-text'
								}
							>
								{skill}
							</span>
						</label>
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
