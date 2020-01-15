const LocationSanitiser = value => {
  switch ((value || '').toLowerCase()) {
    case 'sydney':
    case 'melbourne':
    case 'brisbane':
      return value;
    default:
      return 'Others';
  }
};

export default LocationSanitiser;
