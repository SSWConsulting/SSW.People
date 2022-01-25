const SkillToUrl = (skill, services) => {
  const skillResult = services.find(s => s.skills.includes(skill));
  if (skillResult) {
    return serviceToUrlFormat(skillResult.pageName);
  }

  const keyWordResult = services.find(
    s => s.keyWord.length > 0 && skill.indexOf(s.keyWord) != -1
  );
  if (keyWordResult) {
    return serviceToUrlFormat(keyWordResult.pageName);
  }

  return null;
};

const serviceToUrlFormat = page => {
  if (page == 'Video-Production') {
    return `https://www.ssw.com.au/ssw/Consulting/${page}/`;
  }
  return `https://www.ssw.com.au/ssw/Consulting/${page}.aspx`;
};

export default SkillToUrl;
