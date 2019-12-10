import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';

class ProfileBox extends React.Component {
	constructor(props) {
		super(props);
		this.toggleHover = this.toggleHover.bind(this);
	}

	state = { hover: false };

	toggleHover() {
		this.setState({ hover: !this.state.hover });
	}

	render() {
		const hoverStyle = {
			backgroundColor: '#cc4141',
			color: '#fff',
		};
		const { profile, sanitisedName, profileImages } = this.props;
		const profileImage = this.state.hover
			? profileImages.profileImage
			: profileImages.sketchProfileImage;
		return (
			<Link
				to={`/${sanitisedName}`}
				className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4 unstyled"
			>
				{profileImage !== undefined && (
					<div
						className="relative bg-cover shadow-lg mx-auto profile-image"
						style={{
							backgroundImage: `url(${profileImage.childImageSharp.original.src})`,
							height: '242px',
							width: '172px',
						}}
						onMouseEnter={this.toggleHover}
						onMouseLeave={this.toggleHover}
					>
						<div
							className="absolute inset-x-0 bottom-0 px-1 pb-4 h-15 text-center"
							style={this.state.hover ? hoverStyle : null}
						>
							<div className="font-bold text-sm">{profile.nickname}</div>
							<div className="text-xs leading-none">{profile.role}</div>
						</div>
					</div>
				)}
			</Link>
		);
	}
}

ProfileBox.propTypes = {
	profile: PropTypes.object.isRequired,
	sanitisedName: PropTypes.string.isRequired,
	profileImages: PropTypes.object.isRequired,
};

export default ProfileBox;
