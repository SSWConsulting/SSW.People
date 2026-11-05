import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

// useLayoutEffect warns during server rendering, and there is nothing to
// position there anyway.
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

// px kept clear of the viewport edges and of the badge itself
const GAP = 8;

// Phones have no hover, so the title tooltips badgeHelper.js puts on badges
// never show there. On touch devices, tapping a badge shows its name in a
// small popover instead, and a linked badge follows its link on a second tap.
const BadgeTooltip = () => {
  const [tip, setTip] = useState(null);
  const tipRef = useRef(null);
  const openBadge = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches) return;

    const close = () => {
      openBadge.current = null;
      setTip(null);
    };

    const handleClick = (e) => {
      const badge = e.target.closest('.img-badge');
      const name = badge?.querySelector('img[title]')?.getAttribute('title');

      if (!name || badge === openBadge.current) {
        close();
        return;
      }

      if (e.target.closest('a')) e.preventDefault();

      openBadge.current = badge;
      setTip({
        name,
        anchor: badge.querySelector('img').getBoundingClientRect(),
      });
    };

    document.addEventListener('click', handleClick, true);
    window.addEventListener('scroll', close, { passive: true });
    window.addEventListener('resize', close);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('scroll', close);
      window.removeEventListener('resize', close);
    };
  }, []);

  // Centre above the badge, kept on screen; drop below it near the top edge.
  useIsomorphicLayoutEffect(() => {
    const element = tipRef.current;
    if (!tip || !element) return;

    const { anchor } = tip;
    const { width, height } = element.getBoundingClientRect();
    const centre = anchor.left + anchor.width / 2;
    const left = Math.min(
      Math.max(centre - width / 2, GAP),
      window.innerWidth - width - GAP
    );
    const above = anchor.top - height - GAP;

    element.style.left = `${left}px`;
    element.style.top = `${above >= GAP ? above : anchor.bottom + GAP}px`;
  }, [tip]);

  if (!tip) return null;

  return (
    <div
      ref={tipRef}
      role="tooltip"
      className="fixed left-0 top-0 z-50 max-w-[calc(100vw-1rem)] rounded bg-ssw-black px-2 py-1 text-sm leading-snug text-white shadow-md pointer-events-none"
    >
      {tip.name}
    </div>
  );
};

export default BadgeTooltip;
