import React from 'react';
import PropTypes from 'prop-types';

const SkillsList = ({ crmData }) => {
  let intermediateSkills = [];
  let advancedSkills = [];

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
                {skill}
                {(i !== arr.length - 1 ||
                  (i === arr.length - 1 && intermediateSkills.length > 0)) && (
                  <span className="skill-separator"> | </span>
                )}
              </strong>
            ))}
            {intermediateSkills.map((skill, i, arr) => (
              <span key={`intermediateSkill-${i}`}>
                {skill}
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
};

export default SkillsList;
