const SkillToUrl = (skill, skills) => {
  const skillResult = skills.find(s => s.exactMatch.includes(skill));
  if (skillResult) {
    return skillResult.pageUrl;
  }

  const keyWordResult = skills.find(
    s => s.fuzzyMatch.length > 0 && skill.indexOf(s.fuzzyMatch) != -1
  );
  if (keyWordResult) {
    return keyWordResult.pageUrl;
  }

  return null;
};

export default SkillToUrl;
