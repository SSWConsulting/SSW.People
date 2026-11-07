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

// The badge image under the pointer or finger. Each image sits in its own
// <figure>, so this is the hovered image even in a block holding several.
const imageFrom = (target) => {
  if (!target.closest?.('.img-badge')) return null;

  const figure = target.closest('figure');
  if (figure) return figure.querySelector('img[data-badge-name]');

  return target.matches('img[data-badge-name]') ? target : null;
};

const areaOf = (image) => image.closest('figure') || image;

// Shows a badge's name (set by badgeHelper.js) in a small popover: after a
// short hover with a mouse, straight away on keyboard focus, and on tap on
// touch devices, where a linked badge follows its link on a second tap.
// Escape dismisses it, as WCAG 1.4.13 requires for content shown on hover.
const BadgeTooltip = () => {
  const [tip, setTip] = useState(null);
  const tipRef = useRef(null);
  const openImage = useRef(null);

  useEffect(() => {
    let timer;
    let pendingImage = null;
    // Dismissed with Escape - stays closed until the pointer leaves it.
    let dismissedImage = null;

    const open = (image) => {
      clearTimeout(timer);
      pendingImage = null;
      openImage.current = image;
      setTip({
        name: image.getAttribute('data-badge-name'),
        anchor: image.getBoundingClientRect(),
      });
    };

    const close = () => {
      clearTimeout(timer);
      pendingImage = null;
      openImage.current = null;
      setTip(null);
    };

    const handleClick = (e) => {
      const image = imageFrom(e.target);

      if (!image || image === openImage.current) {
        close();
        return;
      }

      if (e.target.closest('a')) e.preventDefault();
      open(image);
    };

    const handleMouseOver = (e) => {
      const image = imageFrom(e.target);
      if (!image || image === openImage.current) return;
      if (image === pendingImage || image === dismissedImage) return;

      clearTimeout(timer);
      pendingImage = image;
      timer = setTimeout(() => open(image), HOVER_DELAY);
    };

    const handleMouseOut = (e) => {
      const image = imageFrom(e.target);
      if (!image || areaOf(image).contains(e.relatedTarget)) return;

      if (image === dismissedImage) dismissedImage = null;
      close();
    };

    const handleKeyDown = (e) => {
      if (e.key !== 'Escape' || !(openImage.current || pendingImage)) return;

      dismissedImage = openImage.current || pendingImage;
      close();
    };

    const handleFocusIn = (e) => {
      const image = imageFrom(e.target);
      if (image) open(image);
    };

    const handleFocusOut = (e) => {
      if (imageFrom(e.target)) close();
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
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('scroll', close, { passive: true });
    window.addEventListener('resize', close);

    return () => {
      clearTimeout(timer);
      listeners.forEach(([type, listener, capture]) =>
        document.removeEventListener(type, listener, capture)
      );
      document.removeEventListener('keydown', handleKeyDown);
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
