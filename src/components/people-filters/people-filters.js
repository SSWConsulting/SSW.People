import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Filter from '../filter/filter';

const PeopleFilters = ({
  allRoles,
  rolesCount,
  allSkills,
  skillsCount,
  allEvents,
  eventsCount,
  onFilterChange,
}) => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  useEffect(() => {
    onFilterChange([
      { name: 'roles', selected: selectedRoles },
      { name: 'skills', selected: selectedSkills },
      { name: 'events', selected: selectedEvents },
    ]);
  }, [selectedEvents, selectedSkills, selectedRoles, onFilterChange]);

  return (
    <>
      <div className="w-full sm:w-1/2 lg:w-full">
        <Filter
          filterTitle="Roles"
          filterUrlTitle="role"
          allFilterItems={allRoles}
          selectedItems={selectedRoles}
          onItemChange={setSelectedRoles}
          filterCounts={rolesCount}
        />
      </div>
      {!!allEvents.length && (
        <div className="w-full sm:w-1/2 lg:w-full mt-0 lg:mt-4">
          <Filter
            filterTitle="Upcoming speakers"
            filterUrlTitle="event"
            allFilterItems={allEvents}
            selectedItems={selectedEvents}
            onItemChange={setSelectedEvents}
            filterCounts={eventsCount}
          />
        </div>
      )}
      <div className="w-full sm:w-1/2 lg:w-full mt-0 lg:mt-4">
        <Filter
          filterTitle="Tech (by Count)"
          filterUrlTitle="skill"
          allFilterItems={allSkills}
          selectedItems={selectedSkills}
          onItemChange={setSelectedSkills}
          filterCounts={skillsCount}
        />
      </div>
    </>
  );
};

PeopleFilters.propTypes = {
  allSkills: PropTypes.array.isRequired,
  skillsCount: PropTypes.array.isRequired,
  allEvents: PropTypes.array.isRequired,
  eventsCount: PropTypes.array.isRequired,
  allRoles: PropTypes.array.isRequired,
  rolesCount: PropTypes.array.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default PeopleFilters;
