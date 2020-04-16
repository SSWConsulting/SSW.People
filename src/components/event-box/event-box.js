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
          {event.technologycategory && (
            <p className="key_technology">
              <span className="key_technology_title"> Technology:</span>
              {event.technologycategory}
            </p>
          )}
          {event.eventtype && (
            <p className="key_type">
              <span className="key_type_title"> Type:</span>
              {event.eventtype}
            </p>
          )}
          {event.presenter && (
            <p className="key_presenter">
              <span className="key_presenter_title"> Presenter:</span>
              {event.presenterprofileurl && (
                <a
                  target="_blank"
                  href={event.presenterprofileurl}
                  rel="noopener noreferrer"
                >
                  {event.presenter}
                </a>
              )}
              {!event.presenterprofileurl && event.presenter}
            </p>
          )}

          <div
            className="key-description"
            dangerouslySetInnerHTML={{
              __html: event.description,
            }}
          ></div>

          <a href={event.url} className="key-more ignore">
            Find out more...
          </a>
        </div>
      </div>
    </div>
  );
};

EventBox.propTypes = {
  event: PropTypes.object.isRequired,
};

export default EventBox;
