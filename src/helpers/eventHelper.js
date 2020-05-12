import moment from 'moment';

async function getEventsPresenters() {
  var dateFilter = new Date().toISOString();
  var oDataFilterOngoing = `$filter=Enabled ne false and EndDateTime ge datetime'${dateFilter}'%26$select=StartDateTime,Presenter,CalendarType%26$orderby=StartDateTime asc%26$top=50`;
  var presentersEvents;
  await fetch(
    `https://www.ssw.com.au/ssw/SharePointEventsService.aspx?odataFilter=${oDataFilterOngoing}`
  )
    .then(response => response.text())
    .then(result => {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(result, 'application/xml');
      var presentersEventsXml = xmlDoc.getElementsByTagName('properties');

      presentersEvents = Array.prototype.map.call(
        presentersEventsXml,
        element => {
          return {
            eventType: element.getElementsByTagName('CalendarType')[0]
              .textContent,
            presenter: element.getElementsByTagName('Presenter')[0].textContent,
          };
        }
      );
      presentersEvents = presentersEvents.sort(
        (a, b) => a.eventtype - b.eventtype
      );
    });
  return presentersEvents;
}

async function getEventsForPresenter(name, nickname) {
  const dateFilter = new Date().toISOString();
  const oDataFilterOngoing = `$filter=(substringof('${name}',Presenter) or substringof('${nickname}',Presenter)) and Enabled ne false and EndDateTime ge datetime'${dateFilter}'%26$select=StartDateTime,EndDateTime,Category,CalendarType,Title,Url,Thumbnail,Presenter,EventShortDescription%26$orderby=StartDateTime asc%26$top=50`;
  return await fetchFromSharepoint(oDataFilterOngoing, 'asc');
}

async function getPastEventsForPresenter(name, nickname) {
  const dateFilter = new Date().toISOString();
  const oDataFilterOngoing = `$filter=(substringof('${name}',Presenter) or substringof('${nickname}',Presenter)) and Enabled ne false and EndDateTime lt datetime'${dateFilter}'%26$select=StartDateTime,EndDateTime,Category,CalendarType,Title,Url,Thumbnail,Presenter,EventShortDescription%26$orderby=StartDateTime desc%26$top=50`;
  return await fetchFromSharepoint(oDataFilterOngoing, 'desc');
}

async function fetchFromSharepoint(oDataFilterOngoing, sort) {
  var events;
  await fetch(
    `https://www.ssw.com.au/ssw/SharePointEventsService.aspx?odataFilter=${encodeURI(
      oDataFilterOngoing
    )}`
  )
    .then(response => response.text())
    .then(result => {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(result, 'application/xml');
      var eventsXml = xmlDoc.getElementsByTagName('properties');
      events = Array.prototype.map.call(eventsXml, element =>
        mapXmlToEventObj(element)
      );
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
    .catch(() => (events = []));
  return events;
}

function mapXmlToEventObj(properties) {
  const today = moment()
    .local()
    .format('DD MMM YYYY');
  const endDateTimeXml = properties.getElementsByTagName('EndDateTime')[0]
    .textContent;
  const startdatetimeXml = properties.getElementsByTagName('StartDateTime')[0]
    .textContent;
  const startdatetime = moment(startdatetimeXml)
    .local()
    .format('DD MMM YYYY');
  const endDateTime = moment(endDateTimeXml)
    .local()
    .format('DD MMM YYYY');

  return {
    url: properties
      .getElementsByTagName('Url')[0]
      .getElementsByTagName('Url')[0].textContent,
    image: properties
      .getElementsByTagName('Thumbnail')[0]
      .getElementsByTagName('Url')[0].textContent,
    title: properties
      .getElementsByTagName('Url')[0]
      .getElementsByTagName('Description')[0].textContent,
    startdatetime: startdatetime,
    endDateTime: endDateTime,
    isSameDay: startdatetime === endDateTime,
    daysToGo: moment(startdatetime).diff(moment(today), 'days'),
    technologycategory: properties.getElementsByTagName('Category')[0]
      .textContent,
    eventtype: properties.getElementsByTagName('CalendarType')[0].textContent,
    presenter: properties.getElementsByTagName('Presenter')[0].textContent,
    presenterprofileurl: null,
    description: properties.getElementsByTagName('EventShortDescription')[0]
      .textContent,
  };
}

const isInPresenters = (profile, presenters) => {
  return (
    (profile.nickname &&
      profile.nickname.length > 0 &&
      presenters.toLowerCase().indexOf(profile.nickname.toLowerCase()) >= 0) ||
    presenters.toLowerCase().indexOf(profile.fullName.toLowerCase()) >= 0
  );
};

const getPresentersOfEventType = (eventType, allEvents, people) => {
  return people.filter(
    p =>
      allEvents &&
      Array.prototype.filter.call(
        allEvents,
        pr =>
          pr.eventType === eventType && isInPresenters(p.profile, pr.presenter)
      ).length > 0
  );
};

const isPresenterOfEventType = (eventType, profile, events) => {
  const eventsOfType = Array.prototype.filter.call(
    events,
    e => e.eventType === eventType
  );
  return (
    Array.prototype.filter.call(eventsOfType, e =>
      isInPresenters(profile, e.presenter)
    ).length > 0
  );
};

export {
  getEventsPresenters,
  getEventsForPresenter,
  getPastEventsForPresenter,
  isInPresenters,
  getPresentersOfEventType,
  isPresenterOfEventType,
};
