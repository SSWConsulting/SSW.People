import React from 'react';
import PropTypes from 'prop-types';
import { profilesRepo } from '../../../site-config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const profileChineseTag = '-Chinese';

const ActionButtons = ({ profileId }) => {
  return (
    <div className="action-btn-container print-hidden">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`${profilesRepo}/blob/main/${profileId.replace(
          profileChineseTag,
          ''
        )}/${profileId}.md`}
        className="action-btn-link"
      >
        <div className="action-btn-label">Edit</div>
        <FontAwesomeIcon
          icon={faGithub}
          aria-label="logo"
          className="ml-2 order-2"
          size="1x"
        />
      </a>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/SSWConsulting/SSW.People.Profiles/wiki"
        className="action-btn-link"
      >
        <div className="action-btn-label">Info</div>
        <FontAwesomeIcon
          icon={faQuestionCircle}
          aria-label="logo"
          className="ml-2 order-2"
          size="1x"
        />
      </a>
    </div>
  );
};

ActionButtons.propTypes = {
  profileId: PropTypes.string.isRequired,
};

export default ActionButtons;
