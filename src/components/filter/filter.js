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

const Filter = ({
  filterTitle,
  filterUrlTitle,
  allFilterItems,
  selectedItems,
  onItemChange,
  search,
  filterCounts,
}) => {
  const node = useRef();
  const [listOpen, setListOpen] = useState(false);

  const onItemClicked = item => {
    const previouslySelected = isItemSelected(item);
    if (previouslySelected) {
      onItemChange(selectedItems.filter(s => s !== item));
      updateUrlFilter(filterUrlTitle, search, item, false);
    } else {
      onItemChange([item, ...selectedItems]);
      updateUrlFilter(filterUrlTitle, search, item, true);
    }
  };

  const clearFilter = () => {
    onItemChange([]);
    setListOpen(false);
    clearUrlFilter(filterUrlTitle, search);
  };

  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setListOpen(false);
  };

  const isItemSelected = skill => {
    return selectedItems.indexOf(skill) !== -1;
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const UrlFilter = search[filterUrlTitle];
  initFilter(
    UrlFilter,
    allFilterItems,
    isItemSelected,
    selectedItems,
    onItemChange
  );

  return (
    <>
      <div ref={node} className="relative lg:static">
        <div className="flex justify-between items-center align-middle">
          <div className="block lg:hidden">
            <h4
              className="cursor-pointer font-bold whitespace-no-wrap"
              onClick={() => setListOpen(!listOpen)}
            >
              {filterTitle + ' '}
              <FontAwesomeIcon icon={listOpen ? faAngleUp : faAngleDown} />
            </h4>
          </div>
          <div className="hidden lg:block">
            <h4 className="cursor-pointer font-bold whitespace-no-wrap">
              {filterTitle}
            </h4>
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <small
            className={
              selectedItems.length > 0
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
          {allFilterItems.map((item, i) => (
            <li key={i} className="category w-full">
              <Checkbox
                labelText={item}
                checkboxValue={item}
                isChecked={isItemSelected(item)}
                onChange={() => onItemClicked(item)}
                checkedIcon={faCheck}
                checkedClassName="font-bold"
                checkboxColor={isItemSelected(item) ? '#cc4141' : ''}
                checkboxCount={filterCounts.find(i => i.item === item).count}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

Filter.propTypes = {
  filterTitle: PropTypes.string.isRequired,
  filterUrlTitle: PropTypes.string.isRequired,
  allFilterItems: PropTypes.array.isRequired,
  selectedItems: PropTypes.array.isRequired,
  onItemChange: PropTypes.func.isRequired,
  search: PropTypes.object,
  filterCounts: PropTypes.array.isRequired,
};

export default withURLLocation(Filter);
