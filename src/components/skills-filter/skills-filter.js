/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../checkbox';
import {
  faCheck,
  faAngleUp,
  faAngleDown,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../style.css';

const SkillsFilter = ({ allSkills, selectedSkills, onSkillChange }) => {
  const node = useRef();
  const [listOpen, setListOpen] = useState(false);

  const onSkillClicked = skill => {
    const previouslySelected = isSkillSelected(skill);
    if (previouslySelected) {
      onSkillChange(selectedSkills.filter(s => s !== skill));
    } else {
      onSkillChange([skill, ...selectedSkills]);
    }
  };

  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setListOpen(false);
  };

  const isSkillSelected = skill => {
    return selectedSkills.indexOf(skill) !== -1;
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <>
      <div ref={node} className="relative lg:static">
        <div className="flex justify-between items-center align-middle">
          <div className="block sm:block lg:hidden">
            <h4
              className="font-bold whitespace-no-wrap"
              onClick={() => setListOpen(!listOpen)}
            >
              Technologies{' '}
              <FontAwesomeIcon icon={listOpen ? faAngleUp : faAngleDown} />
            </h4>
          </div>
          <div className="hidden sm:hidden lg:block">
            <h4 className="font-bold whitespace-no-wrap">Technologies</h4>
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <small
            className={
              selectedSkills.length > 0
                ? 'text-ssw-red cursor-pointer mb-1 mr-2'
                : 'hidden'
            }
            onClick={() => {
              onSkillChange([]);
              setListOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faTimes} className='mr-1' />
            Clear filter
          </small>
        </div>
        <ul
          className={
            listOpen
              ? 'filter-skills lg:ml-0 absolute lg:border-0 border border-ssw-grey lg:static w-full z-50 lg:z.0 bg-white'
              : 'filter-skills hidden lg:inline'
          }
        >
          {allSkills.map((skill, i) => (
            <li key={i} className="category w-full">
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
