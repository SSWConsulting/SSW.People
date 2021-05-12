import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  getEventsForPresenter,
  getPastEventsForPresenter,
} from '../../helpers/eventHelper';
import EventBox from '../event-box/event-box';
import Button from '../button/button';
import { faSquare, faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

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
      {allEvents && allEvents.length > 0 && (
        <div>
          <div>
            <h2>
              <span role="img" aria-label="Speaker">
                🎙️
              </span>
              &nbsp;Upcoming talks
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
      <div className="flex more-talks-buttons-list">
        <div className="w-1/2">
          {allEvents && allEvents.length > visibleTalks && (
            <Button
              labelText={
                !showMoreActive ? ' Show More Talks' : ' Show Less Talks'
              }
              inActiveIcon={faPlus}
              activeIcon={faMinus}
              isActive={showMoreActive}
              onClick={() => setShowMoreActive(!showMoreActive)}
              activeClassName="btn-more"
              inActiveClassName="btn-more"
            />
          )}
        </div>
        <div className="w-1/2">
          {allPastEvents &&
            allPastEvents.length > 0 &&
            allEvents &&
            allEvents.length > 0 && (
              <Button
                labelText={
                  !showPastTalksActive
                    ? ' Include Past Talks'
                    : ' Include Past Talks'
                }
                activeIcon={faCheckSquare}
                inActiveIcon={faSquare}
                isActive={showPastTalksActive}
                onClick={() => setShowPastTalksActive(!showPastTalksActive)}
                activeClassName="btn-archive-active"
                inActiveClassName="btn-archive"
              />
            )}
        </div>
      </div>
      {allPastEvents &&
        allPastEvents.length > 0 &&
        (showPastTalksActive || !(allEvents && allEvents.length > 0)) && (
          <div className="archive-list">
            <div>
              <h2>
                <span role="img" aria-label="Speaker">
                  🎙️
                </span>
                &nbsp;Past talks
              </h2>
            </div>
            <div className="past-talks-grid">
              {allPastEvents &&
                allPastEvents.map((event, index) => (
                  <EventBox key={index} event={event}></EventBox>
                ))}
            </div>
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
