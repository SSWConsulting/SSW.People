import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  getEventsForPresenter,
  getPastEventsForPresenter,
} from '../../helpers/eventHelper';
import EventBox from '../event-box/event-box';
import Button from '../button/button';

const EventList = ({ presenterName, presenterNickname }) => {
  const visibleTalks = 5;
  const [showMoreActive, setShowMoreActive] = useState(false);
  const [events, setEvents] = useState(null);
  const [allEvents, setAllEvents] = useState(null);
  const [allPastEvents, setAllPastEvents] = useState(null);
  const [showPastTalksActive, setShowPastTalksActive] = useState(false);

  async function loadEventsPresenters() {
    var allEvents = await getEventsForPresenter(
      presenterName,
      presenterNickname
    );
    setAllEvents(allEvents);
    if (allEvents.length > visibleTalks) {
      setEvents(allEvents.slice(0, visibleTalks));
    }

    var allPastEvents = await getPastEventsForPresenter(
      presenterName,
      presenterNickname
    );
    setAllPastEvents(allPastEvents);
  }

  useEffect(() => {
    if (!allEvents) {
      loadEventsPresenters();
    }
  });

  return (
    <>
      {((allEvents && allEvents.length > 0) ||
        (allPastEvents && allPastEvents.length > 0)) && (
        <div>
          <div>
            <h2>
              <span role="img" aria-label="Speaker">
                🔊
              </span>
              Next talks
            </h2>
          </div>
          {allEvents &&
            (allEvents.length <= visibleTalks ||
              (allEvents.length > visibleTalks && showMoreActive)) &&
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

      <div className="flex flex-col">
        <div className="w-full">
          {allEvents && allEvents.length > visibleTalks && (
            <Button
              labelText={
                !showMoreActive ? '(Show more talks >)' : ' (< Show less talks)'
              }
              isActive={showMoreActive}
              onClick={() => setShowMoreActive(!showMoreActive)}
              activeClassName="btn-more"
              inActiveClassName="btn-more"
            />
          )}
        </div>
        <div className="w-full">
          {allPastEvents && allPastEvents.length > 0 && (
            <Button
              labelText={
                !showPastTalksActive ? 'Show past talks >' : '< Hide past talks'
              }
              isActive={showPastTalksActive}
              onClick={() => setShowPastTalksActive(!showPastTalksActive)}
              activeClassName="btn-archive"
              inActiveClassName="btn-archive"
            />
          )}
        </div>
      </div>
      {allPastEvents && allPastEvents.length > 0 && (
        <div className="archive-list">
          {allPastEvents &&
            showPastTalksActive &&
            allPastEvents.map((event, index) => (
              <EventBox key={index} event={event}></EventBox>
            ))}
        </div>
      )}
    </>
  );
};
EventList.propTypes = {
  presenterName: PropTypes.string.isRequired,
  presenterNickname: PropTypes.string.isRequired,
};
export default EventList;
