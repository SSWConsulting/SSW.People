import { locationsListForOrdering } from '../../site-config';

const LocationSanitiser = value => {
  if (
    locationsListForOrdering.filter(
      x => x.toLowerCase() === (value || '').toLowerCase()
    ).length > 0
  ) {
    return value;
  } else {
    return 'Others';
  }
};

export default LocationSanitiser;
