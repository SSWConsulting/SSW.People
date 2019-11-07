import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';

const ProfileBox = ({ profile, sanitisedName, profileImages }) => {
	const profileImage = profileImages.find(
		n => n.name === `${sanitisedName}-Profile`
	);
	return (
		<Link
			to={`/${sanitisedName}`}
			className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 mb-4 unstyled"
		>
			<div
				className="relative bg-cover shadow-lg mx-auto"
				style={{
					backgroundImage: `url(${profileImage.childImageSharp.original.src})`,
					height: `${profileImage.childImageSharp.original.height}px`,
					width: `${profileImage.childImageSharp.original.width}px`,
				}}
			>
				<div
					className="absolute inset-x-0 bottom-0 px-6 pb-4 h-20"
					style={{
						backgroundColor: 'rgba(197,48,48,0.75)',
						backdropFilter: 'blur(10px)',
					}}
				>
					<p className="font-bold text-xl">{profile.nickname}</p>
					<p className="text-gray-700 text-xs leading-none">{profile.role}</p>
				</div>
			</div>
		</Link>
	);
};

ProfileBox.propTypes = {
	profile: PropTypes.object.isRequired,
	sanitisedName: PropTypes.string.isRequired,
	profileImages: PropTypes.array.isRequired,
};

export default ProfileBox;
