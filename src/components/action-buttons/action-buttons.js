import React from 'react';
import PropTypes from 'prop-types';
import GitHubIcon from '-!svg-react-loader!../../images/github.svg';
import InfoIcon from '-!svg-react-loader!../../images/info.svg';
import { profilesRepo } from '../../../site-config';

const profileChineseTag = '-Chinese';

const ActionButtons = ({ profileId }) => {
  return (
    <div className="float-right">
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
          <GitHubIcon aria-label="logo" className="action-btn-icon" />
        </a>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://rules.ssw.com.au/make-your-site-easy-to-maintain"
          className="action-btn-link"
        >
          <div className="action-btn-label">Info</div>
          <InfoIcon aria-label="logo" className="action-btn-icon" />
        </a>
      </div>
    </div>
  );
};

ActionButtons.propTypes = {
  profileId: PropTypes.string.isRequired,
};

export default ActionButtons;
