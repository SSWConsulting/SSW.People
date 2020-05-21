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
import withURLLocation from '../withLocation/withURLLocation';
import {
  initFilter,
  updateUrlFilter,
  clearUrlFilter,
} from '../../helpers/queryFilterHelper';

const SkillsFilter = ({
  allSkills,
  selectedSkills,
  onSkillChange,
  search,
  filteredPeople,
}) => {
  const node = useRef();
  const [listOpen, setListOpen] = useState(false);

  const onSkillClicked = skill => {
    const previouslySelected = isSkillSelected(skill);
    if (previouslySelected) {
      onSkillChange(selectedSkills.filter(s => s !== skill));
      updateUrlFilter('skill', search, skill, false);
    } else {
      onSkillChange([skill, ...selectedSkills]);
      updateUrlFilter('skill', search, skill, true);
    }
  };

  const clearFilter = () => {
    onSkillChange([]);
    setListOpen(false);
    clearUrlFilter('skill', search);
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

  const { skill } = search;
  initFilter(skill, allSkills, isSkillSelected, selectedSkills, onSkillChange);

  return (
    <>
      <div ref={node} className="relative lg:static">
        <div className="flex justify-between items-center align-middle">
          <div className="block lg:hidden">
            <h4
              className="cursor-pointer font-bold whitespace-no-wrap"
              onClick={() => setListOpen(!listOpen)}
            >
              Technologies{' '}
              <FontAwesomeIcon icon={listOpen ? faAngleUp : faAngleDown} />
            </h4>
          </div>
          <div className="hidden lg:block">
            <h4 className="cursor-pointer font-bold whitespace-no-wrap">
              Technologies
            </h4>
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <small
            className={
              selectedSkills.length > 0
                ? 'text-ssw-red cursor-pointer mb-1 mr-2'
                : 'hidden'
            }
            onClick={() => {
              clearFilter();
            }}
          >
            <FontAwesomeIcon icon={faTimes} className="mr-1" />
            Clear
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
                checkboxColor={isSkillSelected(skill) ? '#0067b8' : ''}
                checkboxCount={
                  filteredPeople.filter(p => p.skills.find(s => s === skill))
                    .length
                }
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
  search: PropTypes.object,
  filteredPeople: PropTypes.array.isRequired,
};

export default withURLLocation(SkillsFilter);
