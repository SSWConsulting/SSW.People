import queryString from 'query-string';

const initFilter = (
  urlFilter,
  allValues,
  isValueSelected,
  selectedVaules,
  onFilterChange
) => {
  let filterArray = urlFilter ? urlFilter.split(',') : [];
  filterArray.forEach(sk => {
    const valueTxt = allValues.filter(
      s => s.toLowerCase() === sk.toLowerCase()
    )[0];
    if (valueTxt && !isValueSelected(valueTxt)) {
      onFilterChange([valueTxt, ...selectedVaules]);
    }
  });
};

const updateUrlFilter = (filtername, search, filterToAdd, add) => {
  let filterArray = search[filtername] ? search[filtername].split(',') : [];
  if (add) {
    filterArray.push(filterToAdd);
  } else {
    filterArray = filterArray.filter(s => s !== filterToAdd);
  }
  search[filtername] = filterArray.join(',');
  history.pushState(
    { search },
    filtername,
    '?' + queryString.stringify(search)
  );
};

const clearUrlFilter = (filtername, search) => {
  delete search[filtername];
  const query = queryString.stringify(search);
  history.pushState({ search }, filtername, '?' + query);
};

export { initFilter, updateUrlFilter, clearUrlFilter };
