import React, { useState } from 'react';
import * as menu from '../../../lib/ssw.megamenu/megamenu';
import '../../../lib/ssw.megamenu/megamenu.css';

const Menu = () => {
  const [registered, setRegistered] = useState(false);
  const registerEvents = () => {
    if (!registered) {
      setRegistered(true);
      menu.registerEvents('content', mobileMenuOpeningCallBack);
    }
  };

  const mobileMenuOpeningCallBack = (open) => {
    if (open) {
      document.getElementById('mobilescroll').style.overflow = 'hidden';
    } else {
      document.getElementById('mobilescroll').style.overflow = 'auto';
    }
  };

  const getHtml = () => {
    return menu.buildMegaMenu();
  };

  return (
    <div className="mx-2 md:mx-6">
      <div
        id="sswmegamenu"
        onMouseOver={() => registerEvents()}
        onFocus={() => registerEvents()}
        dangerouslySetInnerHTML={{
          __html: getHtml(),
        }}
      ></div>
    </div>
  );
};

export default Menu;
