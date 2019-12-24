const locationOrdering = ['All', 'Sydney', 'Melbourne', 'Brisbane', 'Other'];

const LocationSort = (a,b) => {
    return (locationOrdering.indexOf(a) - locationOrdering.indexOf(b)) || a.localeCompare(b);
};

export default LocationSort;