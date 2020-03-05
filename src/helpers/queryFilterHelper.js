import queryString from 'query-string';

const initFilter = (
  urlFilter,
  allValues,
  isValueSelected,
  selectedVaules,
  onFilterChange
) => {
  let filterArray = urlFilter ? urlFilter : [];
  if (typeof filterArray == 'string') filterArray = [filterArray];
  filterArray.forEach(sk => {
    const valueTxt = allValues.filter(
      s => sanitizeFilter(s.toLowerCase()) === sk.toLowerCase()
    )[0];
    if (valueTxt && !isValueSelected(valueTxt)) {
      onFilterChange([valueTxt, ...selectedVaules]);
    }
  });
};

const updateUrlFilter = (filtername, search, filterToAdd, add) => {
  let filterArray = search[filtername] ? search[filtername] : [];
  if (add) {
    filterArray.push(sanitizeFilter(filterToAdd));
  } else {
    filterArray = filterArray.filter(s => s !== sanitizeFilter(filterToAdd));
  }
  search[filtername] = filterArray;
  history.pushState(
    { search },
    filtername,
    '?' + queryString.stringify(search)
  );
};

const sanitizeFilter = filter => {
  return filter.replace(/ - /g,'-').replace(/\s/g,'-');
};

const clearUrlFilter = (filtername, search) => {
  delete search[filtername];
  const query = queryString.stringify(search);
  history.pushState({ search }, filtername, '?' + query);
};

export { initFilter, updateUrlFilter, clearUrlFilter };
