import React from 'react';
import PropTypes from 'prop-types';

const SkillsList = ({ crmData }) => {
  const intermediateSkills = crmData?.skills?.intermediateSkills ?? [];
  const advancedSkills = crmData?.skills?.advancedSkills ?? [];

  return (
    <>
      {((advancedSkills && !!advancedSkills.length) ||
        (intermediateSkills && !!intermediateSkills.length)) && (
        <>
          <h2 className="text-ssw-red mb-0">Skills</h2>
          <span>
            {advancedSkills.map((skill, i, arr) => (
              <strong key={`advancedSkill-${i}`}>
                <SkillLink skill={skill} />
                {(i !== arr.length - 1 ||
                  (i === arr.length - 1 && intermediateSkills.length > 0)) && (
                  <span className="skill-separator"> | </span>
                )}
              </strong>
            ))}
            {intermediateSkills.map((skill, i, arr) => (
              <span key={`intermediateSkill-${i}`}>
                <SkillLink skill={skill} />
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

const SkillLink = ({ skill }) => {
  return skill.marketingPageUrl ? (
    <a href={skill.marketingPageUrl}>{skill.service}</a>
  ) : (
    <span>{skill.service}</span>
  );
};

SkillsList.propTypes = {
  crmData: PropTypes.object.isRequired,
};

SkillLink.propTypes = {
  skill: PropTypes.object.isRequired,
};

export default SkillsList;
