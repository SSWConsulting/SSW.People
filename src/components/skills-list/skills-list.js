import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const SkillsList = ({ crmData }) => {
  const intermediateSkills = crmData?.skills?.intermediateSkills ?? [];
  const advancedSkills = crmData?.skills?.advancedSkills ?? [];

  const skillsRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);

  // Only measure while collapsed - once expanded the element never overflows,
  // so re-measuring would hide the 'Show less' button.
  useEffect(() => {
    const element = skillsRef.current;
    if (!element || isExpanded) return;

    const checkOverflow = () =>
      setCanExpand(element.scrollHeight > element.clientHeight + 1);

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [isExpanded]);

  return (
    <>
      {((advancedSkills && !!advancedSkills.length) ||
        (intermediateSkills && !!intermediateSkills.length)) && (
        <>
          <h2>Skills</h2>
          <div
            ref={skillsRef}
            className={`print:line-clamp-none ${isExpanded ? '' : 'line-clamp-3'}`}
          >
            {advancedSkills.map((skill, i, arr) => (
              <strong key={`advancedSkill-${i}`}>
                <SkillLink skill={skill} />
                {(i !== arr.length - 1 ||
                  (i === arr.length - 1 && intermediateSkills.length > 0)) && (
                  <span className="font-light opacity-30 mx-1"> | </span>
                )}
              </strong>
            ))}
            {intermediateSkills.map((skill, i, arr) => (
              <span key={`intermediateSkill-${i}`}>
                <SkillLink skill={skill} />
                {i !== arr.length - 1 && (
                  <span className="font-light opacity-30 mx-1"> | </span>
                )}
              </span>
            ))}
          </div>
          {canExpand && (
            <button
              type="button"
              className="mt-1 text-ssw-red underline print-hidden"
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded((expanded) => !expanded)}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
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
