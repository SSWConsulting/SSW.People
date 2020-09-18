import React, { useState, useRef } from 'react';
import { Link } from 'gatsby';
import SketchPlaceholder from '../../images/ssw-employee-profile-placeholder-sketch.jpg';
import ProfilePlaceholder from '../../images/ssw-employee-profile-placeholder-profile.jpg';
import { alumniPrefix } from '../../../site-config';

const LinkAlumni = () => {
  const linkRef = useRef();
  const [placeHolder, setPlaceHolder] = useState(SketchPlaceholder);

  return (
    <Link
      ref={linkRef}
      to={alumniPrefix}
      onMouseOver={() => setPlaceHolder(ProfilePlaceholder)}
      onFocus={() => setPlaceHolder(ProfilePlaceholder)}
      onMouseOut={() => setPlaceHolder(SketchPlaceholder)}
      onBlur={() => setPlaceHolder(SketchPlaceholder)}
    >
      Visit our alumni
      <img
        src={placeHolder}
        alt=""
        className="inline h-24 transform shadow-lg mx-4"
      />
    </Link>
  );
};

export default LinkAlumni;
