const ProfileSort = (a, b) => {
  if (a.sanitisedName.toLowerCase() === 'we-are-hiring') {
    return 1;
  } else if (b.sanitisedName.toLowerCase() === 'we-are-hiring') {
    return -1;
  }

  let sorting = b.billingRate - a.billingRate;

  if (sorting === 0) {
    //must be equal
    sorting =
      a.profile.jobTitle?.toLowerCase() < b.profile.jobTitle?.toLowerCase()
        ? -1
        : a.profile.jobTitle?.toLowerCase() > b.profile.jobTitle?.toLowerCase()
        ? 1
        : 0;
  }

  if (sorting === 0)
    //must be equal
    sorting =
      a.sanitisedName.toLowerCase() < b.sanitisedName.toLowerCase()
        ? -1
        : a.sanitisedName.toLowerCase() > b.sanitisedName.toLowerCase()
        ? 1
        : 0;

  return sorting;
};

export default ProfileSort;
