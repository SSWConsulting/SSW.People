const ProfileSort = (a, b) => {
  if (
    a.sanitisedName.toLowerCase() === 'we-are-hiring'
  ) {
    return 1;
  } else if (
    b.sanitisedName.toLowerCase() === 'we-are-hiring'
  ) {
    return -1;
  }

  let sorting = b.billingRate - a.billingRate;

  if (sorting === 0) //must be equal
    sorting = a.sanitisedName < b.sanitisedName;

  return sorting;
};

export default ProfileSort;
