async function getEventsPresenters() {
  var dateFilter = new Date().toISOString();
  var oDataFilterOngoing = `$filter=Enabled ne false and EndDateTime ge datetime'${dateFilter}'&select=StartDateTime,Presenter&$orderby=StartDateTime asc&$top=50`;
  var presenters;
  await fetch(
    `https://www.ssw.com.au/ssw/SharePointEventsService.aspx?odataFilter=${oDataFilterOngoing}`
  )
    .then(response => response.text())
    .then(result => {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(result, 'application/xml');
      presenters = xmlDoc.getElementsByTagName('Presenter');
    });
  return presenters;
}

async function getEventsForPresenter(name, nickname) {
  var dateFilter = new Date().toISOString();
  var oDataFilterOngoing = `$filter=(substringof('${name}',Presenter) or substringof('${nickname}',Presenter)) and Enabled ne false and EndDateTime ge datetime'${dateFilter}'&select=StartDateTime,Category,CalendarType,Title,Url,Thumbnail,Presenter,EventShortDescription&$orderby=StartDateTime asc&$top=50`;
  var presenters;
  await fetch(
    `https://www.ssw.com.au/ssw/SharePointEventsService.aspx?odataFilter=${oDataFilterOngoing}`
  )
    .then(response => response.text())
    .then(result => {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(result, 'application/xml');
      presenters = xmlDoc.getElementsByTagName('properties');
    });
  return presenters;
}

export { getEventsPresenters, getEventsForPresenter };
