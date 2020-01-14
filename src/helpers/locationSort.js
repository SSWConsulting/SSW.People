const locationOrdering = ['All', 'Sydney', 'Melbourne', 'Brisbane', 'Others'];

const LocationSort = (a, b) => {
  return (
    locationOrdering.indexOf(a) - locationOrdering.indexOf(b) ||
    a.localeCompare(b)
  );
};

export default LocationSort;
