import moment from 'moment';
import { hyphenate } from './hyphenate';
const EventsApi = process.env.WEBSITE_API;

async function getEventsPresenters() {
  let presentersEvents;
  await fetch(`${EventsApi}events/upcoming?top=${50}`)
    .then((response) => response.json())
    .then((result) => {
      presentersEvents = result.map((element) => {
        return {
          eventType: element.CalendarType,
          presenter: element.Presenter,
        };
      });
      presentersEvents = presentersEvents.sort(
        (a, b) => a.eventtype - b.eventtype
      );
    });
  return presentersEvents;
}

async function getEventsForPresenter(name) {
  name = hyphenate(name);
  const url = `${EventsApi}events/upcoming?presenterName=${name}`;
  return await fetchEvents(url, 'asc');
}

async function getPastEventsForPresenter(name) {
  name = hyphenate(name);
  const url = `${EventsApi}events/past?presenterName=${name}`;
  return await fetchEvents(url, 'desc');
}

async function fetchEvents(url, sort) {
  var events;
  await fetch(url)
    .then((response) => response.json())
    .then((result) => {
      events = Array.prototype.map.call(result, (element) => mapEvent(element));

      if (sort === 'asc') {
        events = events.sort((a, b) =>
          moment(a.startdatetime, 'DD MMM YYYY').diff(
            moment(b.startdatetime, 'DD MMM YYYY')
          )
        );
      } else if (sort === 'desc') {
        events = events.sort((a, b) =>
          moment(b.startdatetime, 'DD MMM YYYY').diff(
            moment(a.startdatetime, 'DD MMM YYYY')
          )
        );
      }
    })
    .catch((error) => {
      events = [];
    });
  return events;
}

function mapEvent(properties) {
  const today = moment().local().format('DD MMM YYYY');
  const endDateTimeXml = properties.EndDateTime;
  const startdatetimeXml = properties.StartDateTime;
  const startdatetime = moment(startdatetimeXml).local().format('DD MMM YYYY');
  const endDateTime = moment(endDateTimeXml).local().format('DD MMM YYYY');

  return {
    url: properties.Url.Url.replace('http:', 'https:'),

    image: properties.Thumbnail.Url.replace('http:', 'https:'),
    title: properties.Url.Description,
    startdatetime: startdatetime,
    endDateTime: endDateTime,
    isSameDay: startdatetime === endDateTime,
    daysToGo: moment(startdatetime).diff(moment(today), 'days'),
    technologycategory: properties.Category,
    eventtype: properties.CalendarType,
    presenter: properties.Presenter,

    presenterprofileurl: null,
    description: properties.EventShortDescription,
  };
}

const isInPresenters = (profile, presenters) => {
  if (!presenters) return;
  return (
    (profile.nickname?.length &&
      presenters.toLowerCase().indexOf(profile.nickname.toLowerCase()) >= 0) ||
    presenters.toLowerCase().indexOf(profile.fullName.toLowerCase()) >= 0
  );
};

const getPresentersOfEventType = (eventType, allEvents, people) => {
  return people.filter(
    (p) =>
      allEvents &&
      Array.prototype.filter.call(
        allEvents,
        (pr) =>
          pr.eventType === eventType && isInPresenters(p.profile, pr.presenter)
      ).length > 0
  );
};

const isPresenterOfEventType = (eventType, profile, events) => {
  const eventsOfType = Array.prototype.filter.call(
    events,
    (e) => e.eventType === eventType
  );
  return (
    Array.prototype.filter.call(eventsOfType, (e) =>
      isInPresenters(profile, e.presenter)
    ).length > 0
  );
};

export {
  getEventsForPresenter,
  getEventsPresenters,
  getPastEventsForPresenter,
  getPresentersOfEventType,
  isInPresenters,
  isPresenterOfEventType,
};
