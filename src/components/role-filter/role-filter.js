/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../checkbox';
import {
  faAngleDown,
  faAngleUp,
  faCheck,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import RoleSort from '../../helpers/roleSort';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../style.css';
import withURLLocation from '../withLocation/withURLLocation';
import {
  initFilter,
  updateUrlFilter,
  clearUrlFilter,
} from '../../helpers/queryFilterHelper';

const RoleFilter = ({
  allRoles,
  selectedRoles,
  onRoleChange,
  filteredPeople,
  search,
}) => {
  const node = useRef();
  const [listOpen, setListOpen] = useState(false);

  const onRoleClicked = role => {
    const previouslySelected = isRoleSelected(role);
    if (previouslySelected) {
      onRoleChange(selectedRoles.filter(s => s !== role));
      updateUrlFilter('role', search, role, false);
    } else {
      onRoleChange([role, ...selectedRoles]);
      updateUrlFilter('role', search, role, true);
    }
  };

  const clearFilter = () => {
    onRoleChange([]);
    setListOpen(false);
    clearUrlFilter('role', search);
  };

  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setListOpen(false);
  };

  const isRoleSelected = role => {
    return selectedRoles.indexOf(role) !== -1;
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const { role } = search;
  initFilter(role, allRoles, isRoleSelected, selectedRoles, onRoleChange);

  return (
    <>
      <div ref={node} className="relative lg:static">
        <div className="flex justify-between items-center align-middle">
          <div className="block lg:hidden">
            <h4
              className="cursor-pointer font-bold whitespace-no-wrap"
              onClick={() => setListOpen(!listOpen)}
            >
              Roles{' '}
              <FontAwesomeIcon icon={listOpen ? faAngleUp : faAngleDown} />
            </h4>
          </div>
          <div className="hidden lg:block ">
            <h4 className="cursor-pointer font-bold whitespace-no-wrap">
              Roles
            </h4>
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <small
            className={
              selectedRoles.length > 0
                ? 'text-ssw-red cursor-pointer mb-1 mr-2'
                : 'hidden'
            }
            onClick={() => {
              clearFilter();
            }}
          >
            <FontAwesomeIcon icon={faTimes} className="mr-1" />
            Clear filter
          </small>
        </div>
        <ul
          className={
            listOpen
              ? 'filter-role mr-1 lg:border-0 border border-ssw-grey absolute bg-white  lg:static w-full z-50 lg:z.0'
              : 'filter-role hidden lg:inline'
          }
        >
          {allRoles.sort(RoleSort).map(role => (
            <li key={role} className="flex category w-full">
              <div className="w-full whitespace-no-wrap">
                <Checkbox
                  labelText={role}
                  checkboxValue={role}
                  checkboxCount={
                    filteredPeople.filter(p => p.role === role).length
                  }
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
  search: PropTypes.object,
};

export default withURLLocation(RoleFilter);
