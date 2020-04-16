import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getEventsForPresenter } from '../../helpers/eventHelper';
import InternalEvent from '../internal-event/internal-event';

const InternalEvents = ({ presenterName, presenterNickname }) => {
  const [events, setEvents] = useState(null);
  async function loadEventsPresenters() {
    var events = await getEventsForPresenter(presenterName, presenterNickname);
    setEvents(events);
  }

  useEffect(() => {
    if (!events) {
      loadEventsPresenters();
    }
  });

  return (
    <>
      {events && events.length > 0 && (
        <div>
          <div>
            <h2>Next talks</h2>
          </div>
          {events.map((event, index) => (
            <InternalEvent key={index} event={event}></InternalEvent>
          ))}
        </div>
      )}
    </>
  );
};
InternalEvents.propTypes = {
  presenterName: PropTypes.string.isRequired,
  presenterNickname: PropTypes.string.isRequired,
};
export default InternalEvents;
