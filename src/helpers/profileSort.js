export const BillingRateSort = (a, b) => {
  let sorting = b.billingRate - a.billingRate;

  if (sorting != 0) {
    return sorting;
  }

  return 0;
};

export const JobSort = (a, b) => {
  return a.profile.jobTitle?.toLowerCase() < b.profile.jobTitle?.toLowerCase()
    ? -1
    : a.profile.jobTitle?.toLowerCase() > b.profile.jobTitle?.toLowerCase()
      ? 1
      : 0;
};

export const AlphabeticalSort = (a, b) => {
  return a.sanitisedName.toLowerCase() < b.sanitisedName.toLowerCase()
    ? -1
    : a.sanitisedName.toLowerCase() > b.sanitisedName.toLowerCase()
      ? 1
      : 0;
};

export const SampleProfileSort = (a, b) => {
  if (a.sanitisedName.toLowerCase() === 'we-are-hiring') {
    return 1;
  } else if (b.sanitisedName.toLowerCase() === 'we-are-hiring') {
    return -1;
  }
};
