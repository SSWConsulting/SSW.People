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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../style.css';
import withURLLocation from '../withLocation/withURLLocation';
import {
  initFilter,
  updateUrlFilter,
  clearUrlFilter,
} from '../../helpers/queryFilterHelper';

const EventFilter = ({ allEvents, selectedEvents, onEventChange, search }) => {
  const node = useRef();
  const [listOpen, setListOpen] = useState(false);

  const onEventClicked = event => {
    const previouslySelected = isEventSelected(event);
    if (previouslySelected) {
      onEventChange(selectedEvents.filter(s => s !== event));
      updateUrlFilter('event', search, event, false);
    } else {
      onEventChange([event, ...selectedEvents]);
      updateUrlFilter('event', search, event, true);
    }
  };

  const clearFilter = () => {
    onEventChange([]);
    setListOpen(false);
    clearUrlFilter('event', search);
  };

  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setListOpen(false);
  };

  const isEventSelected = event => {
    return selectedEvents.indexOf(event) !== -1;
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  const { event } = search;
  initFilter(event, allEvents, isEventSelected, selectedEvents, onEventChange);

  return (
    <>
      <div ref={node} className="relative lg:static">
        <div className="flex justify-between items-center align-middle">
          <div className="block lg:hidden">
            <h4
              className="cursor-pointer font-bold whitespace-no-wrap"
              onClick={() => setListOpen(!listOpen)}
            >
              Upcoming speakers{' '}
              <FontAwesomeIcon icon={listOpen ? faAngleUp : faAngleDown} />
            </h4>
          </div>
          <div className="hidden lg:block ">
            <h4 className="cursor-pointer font-bold whitespace-no-wrap">
              Upcoming speakers
            </h4>
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <small
            className={
              selectedEvents.length > 0
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
              ? 'filter-event mr-1 lg:border-0 border border-ssw-grey absolute bg-white  lg:static w-full z-50 lg:z.0'
              : 'filter-event hidden lg:inline'
          }
        >
          {allEvents.map(event => (
            <li key={event} className="flex category w-full">
              <div className="w-full whitespace-no-wrap">
                <Checkbox
                  labelText={event}
                  checkboxValue={event}
                  isChecked={isEventSelected(event)}
                  onChange={() => onEventClicked(event)}
                  checkedIcon={faCheck}
                  checkedClassName="font-bold"
                  checkboxColor={isEventSelected(event) ? '#cc4141' : ''}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="filter-event"></div>
    </>
  );
};

EventFilter.propTypes = {
  allEvents: PropTypes.array.isRequired,
  selectedEvents: PropTypes.array.isRequired,
  onEventChange: PropTypes.func.isRequired,
  search: PropTypes.object,
};

export default withURLLocation(EventFilter);
