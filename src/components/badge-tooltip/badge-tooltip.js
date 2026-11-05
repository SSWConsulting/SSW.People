import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

// useLayoutEffect warns during server rendering, and there is nothing to
// position there anyway.
const useIsomorphicLayoutEffect =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;

// px kept clear of the viewport edges and of the badge itself
const GAP = 8;

// Long enough that sweeping the pointer across a row of badges doesn't flash
// a tooltip for each one.
const HOVER_DELAY = 300;

const badgeFrom = (target) => target.closest?.('.img-badge');

const nameOf = (badge) =>
  badge?.querySelector('img[data-badge-name]')?.getAttribute('data-badge-name');

// Shows a badge's name (set by badgeHelper.js) in a small popover: after a
// short hover with a mouse, straight away on keyboard focus, and on tap on
// touch devices, where a linked badge follows its link on a second tap.
const BadgeTooltip = () => {
  const [tip, setTip] = useState(null);
  const tipRef = useRef(null);
  const openBadge = useRef(null);

  useEffect(() => {
    let timer;
    let pendingBadge = null;

    const open = (badge) => {
      clearTimeout(timer);
      pendingBadge = null;
      openBadge.current = badge;
      setTip({
        name: nameOf(badge),
        anchor: badge.querySelector('img').getBoundingClientRect(),
      });
    };

    const close = () => {
      clearTimeout(timer);
      pendingBadge = null;
      openBadge.current = null;
      setTip(null);
    };

    const handleClick = (e) => {
      const badge = badgeFrom(e.target);

      if (!nameOf(badge) || badge === openBadge.current) {
        close();
        return;
      }

      if (e.target.closest('a')) e.preventDefault();
      open(badge);
    };

    const handleMouseOver = (e) => {
      const badge = badgeFrom(e.target);
      if (!nameOf(badge) || badge === openBadge.current) return;
      if (badge === pendingBadge) return;

      clearTimeout(timer);
      pendingBadge = badge;
      timer = setTimeout(() => open(badge), HOVER_DELAY);
    };

    const handleMouseOut = (e) => {
      const badge = badgeFrom(e.target);
      if (badge && !badge.contains(e.relatedTarget)) close();
    };

    const handleFocusIn = (e) => {
      const badge = badgeFrom(e.target);
      if (nameOf(badge)) open(badge);
    };

    const handleFocusOut = (e) => {
      if (badgeFrom(e.target)) close();
    };

    const listeners = window.matchMedia('(hover: none)').matches
      ? [['click', handleClick, true]]
      : [
          ['mouseover', handleMouseOver],
          ['mouseout', handleMouseOut],
          ['focusin', handleFocusIn],
          ['focusout', handleFocusOut],
        ];

    listeners.forEach(([type, listener, capture]) =>
      document.addEventListener(type, listener, capture)
    );
    window.addEventListener('scroll', close, { passive: true });
    window.addEventListener('resize', close);

    return () => {
      clearTimeout(timer);
      listeners.forEach(([type, listener, capture]) =>
        document.removeEventListener(type, listener, capture)
      );
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
