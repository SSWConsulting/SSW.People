const SkillSort = (a, b) => {
  let sorting = a.sortOrder - b.sortOrder;

  if (sorting === 0) {
    sorting =
      a.technology.toLowerCase() < b.technology.toLowerCase()
        ? -1
        : a.technology.toLowerCase() > b.technology.toLowerCase()
        ? 1
        : 0;
  }

  return sorting;
};

module.exports = { SkillSort };
//export default SkillSort;
