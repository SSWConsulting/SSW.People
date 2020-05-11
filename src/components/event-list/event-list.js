import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  getEventsForPresenter,
  getPastEventsForPresenter,
} from '../../helpers/eventHelper';
import EventBox from '../event-box/event-box';
import Button from '../button/button';
import { faPlus, faMinus, faArchive } from '@fortawesome/free-solid-svg-icons';

const EventList = ({ presenterName, presenterNickname }) => {
  const visibleTalks = 3;
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
            <h2>Next talks</h2>
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
      <div className="flex">
        <div className="w-1/2">
          {allEvents && allEvents.length > visibleTalks && (
            <Button
              labelText={
                !showMoreActive ? ' Show more talks' : ' Show less talks'
              }
              isActive={showMoreActive}
              onClick={() => setShowMoreActive(!showMoreActive)}
              activeIcon={faMinus}
              inActiveIcon={faPlus}
              activeClassName="btn-more"
              inActiveClassName="btn-more"
            />
          )}
        </div>
        <div className="w-1/2">
          {allPastEvents && allPastEvents.length > 0 && (
            <Button
              labelText={
                !showPastTalksActive ? ' Show past talks' : ' Hide past talks'
              }
              isActive={showPastTalksActive}
              onClick={() => setShowPastTalksActive(!showPastTalksActive)}
              activeIcon={faArchive}
              inActiveIcon={faArchive}
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
