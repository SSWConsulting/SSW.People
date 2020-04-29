import React from 'react';
import PropTypes from 'prop-types';

const EventBox = ({ event }) => {
  return (
    <div>
      <div className="event-item">
        <div className="thumbnail">
          <a className="ignore" href={event.url}>
            <img src={event.image} alt={event.title} />
          </a>
        </div>
        <div className="ourHolder-text">
          <h3>
            <span className="eventtitle">
              {' '}
              <a href={event.url}>{event.title}</a>
            </span>
          </h3>
          <span className="key_datetime">
            {' '}
            {event.startdatetime}
            {!event.isSameDay && `-${event.endDateTime}`}
            {event.daysToGo === 0 && <span className="daystogo">Today</span>}
            {event.daysToGo === 1 && (
              <span className="daystogo">1 Day to go</span>
            )}
            {event.daysToGo > 1 && (
              <span className="daystogo">{event.daysToGo} Days to go</span>
            )}
          </span>
          <p className="key-more">
            <a href={event.url} className="ignore">
              Find out more...
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

EventBox.propTypes = {
  event: PropTypes.object.isRequired,
};

export default EventBox;
