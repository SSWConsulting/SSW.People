import React from 'react';
import moment from 'moment';

const InternalEvent = ({ properties }) => {
  const url = properties
    .getElementsByTagName('Url')[0]
    .getElementsByTagName('Url')[0].textContent;
  const image = properties
    .getElementsByTagName('Thumbnail')[0]
    .getElementsByTagName('Url')[0].textContent;
  const title = properties
    .getElementsByTagName('Url')[0]
    .getElementsByTagName('Description')[0].textContent;

  const startdatetimeXml = properties.getElementsByTagName('StartDateTime')[0]
    .textContent;
  const startdatetime = moment(startdatetimeXml)
    .local()
    .format('DD MMM YYYY');
  var endDateTimeXml = properties.getElementsByTagName('EndDateTime')[0]
    .textContent;
  var endDateTime = moment(endDateTimeXml)
    .local()
    .format('DD MMM YYYY');
  var isSameDay = startdatetime === endDateTime;
  const daysToGo = moment(startdatetime).diff(moment(), 'days');

  const technologycategory = properties.getElementsByTagName('Category')[0]
    .textContent;
  const eventtype = properties.getElementsByTagName('CalendarType')[0]
    .textContent;
  const presenter = properties.getElementsByTagName('Presenter')[0].textContent;
  //const presenterprofileurl=properties.getElementsByTagName("PresenterProfileUrl") && properties.getElementsByTagName("PresenterProfileUrl")[0].getElementsByTagName("Url")? properties.getElementsByTagName("PresenterProfileUrl")[0].getElementsByTagName("Url")[0].textContent: null;
  const presenterprofileurl = null;
  const description = properties.getElementsByTagName(
    'EventShortDescription'
  )[0].textContent;

  return (
    <div>
      <div className="event-item">
        <div className="thumbnail">
          <a className="ignore" href={url}>
            <img src={image} alt={title} />
          </a>
        </div>
        <div className="ourHolder-text">
          <h3>
            <span className="eventtitle">
              {' '}
              <a href={url}>{title}</a>
            </span>
          </h3>
          <span className="key_datetime">
            {' '}
            {startdatetime}
            {!isSameDay && -{ endDateTime }}
            {daysToGo === 0 && <span className="daystogo">Today</span>}
            {daysToGo === 1 && <span className="daystogo">1 Day to go</span>}
            {daysToGo > 1 && (
              <span className="daystogo">{daysToGo} Days to go</span>
            )}
          </span>
          {technologycategory && (
            <p className="key_technology">
              <span className="key_technology_title"> Technology:</span>
              {technologycategory}
            </p>
          )}
          {eventtype && (
            <p className="key_type">
              <span className="key_type_title"> Type:</span>
              {eventtype}
            </p>
          )}
          {presenter && (
            <p className="key_presenter">
              <span className="key_presenter_title"> Presenter:</span>
              {presenterprofileurl && (
                <a
                  target="_blank"
                  href={presenterprofileurl}
                  rel="noopener noreferrer"
                >
                  {presenter}
                </a>
              )}
              {!presenterprofileurl && presenter}
            </p>
          )}

          <div
            className="key-description"
            dangerouslySetInnerHTML={{
              __html: description,
            }}
          ></div>

          <a href={url} className="key-more ignore">
            Find out more...
          </a>
        </div>
      </div>
    </div>
  );
};

export default InternalEvent;
