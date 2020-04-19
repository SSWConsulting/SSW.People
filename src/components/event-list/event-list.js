import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getEventsForPresenter } from '../../helpers/eventHelper';
import EventBox from '../event-box/event-box';
import Button from '../button/button';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const EventList = ({ presenterName, presenterNickname }) => {
  const [showMoreActive, setShowMoreActive] = useState(false);
  const [events, setEvents] = useState(null);
  const [allEvents, setAllEvents] = useState(null);
  async function loadEventsPresenters() {
    var allEvents = await getEventsForPresenter(
      presenterName,
      presenterNickname
    );
    setAllEvents(allEvents);
    if (allEvents.length > 3) {
      setEvents(allEvents.slice(0, 3));
    }
  }

  useEffect(() => {
    if (!allEvents) {
      loadEventsPresenters();
    }
  });

  return (
    <>
      {allEvents && allEvents.length > 0 && (
        <div>
          <div>
            <h2>Next talks</h2>
          </div>
          {allEvents &&
            (allEvents.length <= 3 ||
              (allEvents.length > 3 && showMoreActive)) &&
            allEvents.map((event, index) => (
              <EventBox key={index} event={event}></EventBox>
            ))}
          {events &&
            !showMoreActive &&
            events.map((event, index) => (
              <EventBox key={index} event={event}></EventBox>
            ))}
        </div>
      )}
      {allEvents && allEvents.length > 3 && (
        <Button
          labelText={!showMoreActive ? ' Show more talks' : ' Show less talks'}
          isActive={showMoreActive}
          onClick={() => setShowMoreActive(!showMoreActive)}
          activeIcon={faMinus}
          inActiveIcon={faPlus}
          activeClassName="btn-more"
          inActiveClassName="btn-more"
        />
      )}
    </>
  );
};
EventList.propTypes = {
  presenterName: PropTypes.string.isRequired,
  presenterNickname: PropTypes.string.isRequired,
};
export default EventList;
