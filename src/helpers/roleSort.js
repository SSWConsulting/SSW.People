const roleOrdering = [
  'Vice Presidents',
  'Sales Managers',
  'Coordinators',
  'Sales Representatives',
  'Developers',
];

const RoleSort = (a, b) => {
  return (
    roleOrdering.indexOf(a) - roleOrdering.indexOf(b) || a.localeCompare(b)
  );
};

export default RoleSort;
