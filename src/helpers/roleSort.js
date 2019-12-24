const roleOrdering = ['Managers','Developers','Designers','Admin'];

const RoleSort = (a,b) => {
    return (roleOrdering.indexOf(a) - roleOrdering.indexOf(b)) || a.localeCompare(b);
};

export default RoleSort;