import { locationsListForOrdering } from '../../site-config';
const locationOrdering = ['All', ...locationsListForOrdering, 'Others'];

const LocationSort = (a, b) => {
  return (
    locationOrdering.indexOf(a) - locationOrdering.indexOf(b) ||
    a.localeCompare(b)
  );
};

export default LocationSort;
