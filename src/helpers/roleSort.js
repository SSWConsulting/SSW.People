import { roleListOrdering } from '../../site-config';

const RoleSort = (a, b) => {
  return (
    roleListOrdering.indexOf(a) - roleListOrdering.indexOf(b) ||
    a.localeCompare(b)
  );
};

export default RoleSort;
