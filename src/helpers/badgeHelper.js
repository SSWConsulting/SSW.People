const { badgeNames } = require('./badgeNames');

// Badges are authored as a run of sibling [[imgBadge]] custom blocks, so the
// rendered HTML has no single parent to lay out as a row. Wrap each run of
// consecutive badges in one container the stylesheet can space evenly.
const BADGE_OPEN = '<div class="custom-block img-badge">';
const ROW_OPEN = '<div class="img-badge-row">';

// Index just past the </div> closing the block that starts at startIndex,
// or -1 when the markup is unbalanced.
const findBlockEnd = (html, startIndex) => {
  const tagRegex = /<div\b[^>]*>|<\/div>/g;
  tagRegex.lastIndex = startIndex;

  let depth = 0;
  let match;

  while ((match = tagRegex.exec(html)) !== null) {
    depth += match[0] === '</div>' ? -1 : 1;
    if (depth === 0) return tagRegex.lastIndex;
  }

  return -1;
};

const escapeAttribute = (text) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// Look the badge up by its file name. Badges outside SSW.People.Profiles/badges
// fall back to the author's caption, unless that is just a file name too.
// `following` is the markup after the image, up to the next one.
const getBadgeName = (imgTag, following) => {
  const src = imgTag.match(/\ssrc="([^"]+)"/);
  const file =
    src &&
    src[1]
      .split('/')
      .pop()
      .replace(/\.[a-z0-9]+$/i, '')
      // gatsby-remark-copy-linked-files appends a content hash
      .replace(/-[0-9a-f]{32}$/, '');

  if (file && badgeNames[file]) return escapeAttribute(badgeNames[file]);

  const caption = following.match(/<figcaption>([^<]*)<\/figcaption>/);
  const text = caption && caption[1].trim();
  if (text && !/\.(png|jpe?g|gif|svg|webp)$/i.test(text)) {
    // Already HTML text, so only the quote needs escaping for an attribute.
    return text.replace(/"/g, '&quot;');
  }

  return null;
};

const setAttribute = (tag, attribute, value) => {
  const existing = new RegExp(`\\s${attribute}="[^"]*"`);
  const replacement = ` ${attribute}="${value}"`;

  return existing.test(tag)
    ? tag.replace(existing, () => replacement)
    : tag.replace('<img', () => `<img${replacement}`);
};

// Hand each image's name to BadgeTooltip, which shows it on hover or tap. Not a
// title attribute, or the browser's own tooltip would show as well. It also
// replaces the alt text, which gatsby-remark-images builds from the file name.
const addBadgeNames = (block) =>
  block.replace(/<img\b[^>]*>/g, (img, offset) => {
    const rest = block.slice(offset + img.length);
    const nextImg = rest.search(/<img\b/);
    const name = getBadgeName(
      img,
      nextImg === -1 ? rest : rest.slice(0, nextImg)
    );
    if (!name) return img;

    return setAttribute(
      setAttribute(img, 'alt', name),
      'data-badge-name',
      name
    );
  });

// One [[imgBadge]] block can hold several images, each in its own <figure>.
// Give each its own block, so every image is one item in the row - spaced and
// wrapped like any other badge, rather than stacked inside a single item.
const splitBadgeBlock = (block) => {
  const figures = block.match(/<figure\b[\s\S]*?<\/figure>/g);
  if (!figures || figures.length < 2) return block;

  return figures
    .map(
      (figure) =>
        `${BADGE_OPEN}<div class="custom-block-body">${figure}</div></div>`
    )
    .join('');
};

const wrapBadgeRuns = (html) => {
  if (!html || !html.includes(BADGE_OPEN)) return html;

  let output = '';
  let cursor = 0;

  for (;;) {
    const start = html.indexOf(BADGE_OPEN, cursor);
    if (start === -1) break;

    // Take every badge that follows, allowing only whitespace between them, so
    // badges split up by other content stay in separate rows.
    let row = '';
    let runEnd = start;
    let next = start;

    while (next !== -1 && html.startsWith(BADGE_OPEN, next)) {
      const end = findBlockEnd(html, next);
      if (end === -1) break;

      row +=
        html.slice(runEnd, next) +
        addBadgeNames(splitBadgeBlock(html.slice(next, end)));
      runEnd = end;
      next = end + html.slice(end).match(/^\s*/)[0].length;
    }

    if (runEnd === start) {
      // Unbalanced markup - leave it untouched and keep scanning.
      output += html.slice(cursor, start + BADGE_OPEN.length);
      cursor = start + BADGE_OPEN.length;
      continue;
    }

    output += html.slice(cursor, start) + ROW_OPEN + row + '</div>';
    cursor = runEnd;
  }

  return output + html.slice(cursor);
};

module.exports = { wrapBadgeRuns };
