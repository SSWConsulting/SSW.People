import React from 'react';
import PropTypes from 'prop-types';
import SkillToUrl from '../../helpers/skillToUrl';

const SkillsList = ({ crmData, skillUrlData }) => {
  let intermediateSkills = [];
  let advancedSkills = [];
  let skills = [];

  if (skillUrlData) {
    skills = skillUrlData;
  }

  if (crmData) {
    intermediateSkills = crmData.skills
      ? crmData.skills.intermediateSkills
      : [];
    advancedSkills = crmData.skills ? crmData.skills.advancedSkills : [];
  }

  return (
    <>
      {((advancedSkills && !!advancedSkills.length) ||
        (intermediateSkills && !!intermediateSkills.length)) && (
        <>
          <h2 className="text-ssw-red mb-0">Skills</h2>
          <span>
            {advancedSkills.map((skill, i, arr) => (
              <strong key={`advancedSkill-${i}`}>
                {SkillToUrl(skill, skills) ? (
                  <a href={SkillToUrl(skill, skills)}>{skill}</a>
                ) : (
                  <>{skill}</>
                )}
                {(i !== arr.length - 1 ||
                  (i === arr.length - 1 && intermediateSkills.length > 0)) && (
                  <span className="skill-separator"> | </span>
                )}
              </strong>
            ))}
            {intermediateSkills.map((skill, i, arr) => (
              <span key={`intermediateSkill-${i}`}>
                {SkillToUrl(skill, skills) ? (
                  <a href={SkillToUrl(skill, skills)}>{skill}</a>
                ) : (
                  <>{skill}</>
                )}
                {i !== arr.length - 1 && (
                  <span className="skill-separator"> | </span>
                )}
              </span>
            ))}
          </span>
          <hr className="print-hidden" />
        </>
      )}
    </>
  );
};

SkillsList.propTypes = {
  crmData: PropTypes.object.isRequired,
  skillUrlData: PropTypes.array.isRequired,
};

export default SkillsList;
