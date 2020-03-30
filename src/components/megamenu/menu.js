import React, { useState } from 'react';
import * as menu from '../../../lib/ssw.megamenu/megamenu';
import '../../../lib/ssw.megamenu/megamenu.css';

const Menu = () => {
  const [registered, setRegistered] = useState(false);
  const registerEvents = () => {
    if (!registered) {
      setRegistered(true);
      menu.registerEvents();
    }
  };

  const getHtml = () => {
    return menu.buildMegaMenu();
  };

  return (
    <div className="mx-6">
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
