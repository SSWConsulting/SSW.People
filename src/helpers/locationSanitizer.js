const LocationSanitiser = value => {
  return value;
  /*switch ((value || '').toLowerCase()) {
    case !'Others':
      return value;
    default:
      return 'Others';
  }*/
};

export default LocationSanitiser;
