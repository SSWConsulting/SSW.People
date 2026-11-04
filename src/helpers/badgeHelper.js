// Badges are authored as a run of sibling [[imgBadge]] custom blocks, so the
// rendered HTML has no single parent to make scrollable. Wrap each run of
// consecutive badges in one container the stylesheet can lay out as a row.
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

const wrapBadgeRuns = (html) => {
  if (!html || !html.includes(BADGE_OPEN)) return html;

  let output = '';
  let cursor = 0;

  for (;;) {
    const start = html.indexOf(BADGE_OPEN, cursor);
    if (start === -1) break;

    // Take every badge that follows, allowing only whitespace between them, so
    // badges split up by other content stay in separate rows.
    let runEnd = start;
    let next = start;

    while (next !== -1 && html.startsWith(BADGE_OPEN, next)) {
      const end = findBlockEnd(html, next);
      if (end === -1) break;

      runEnd = end;
      next = end + html.slice(end).match(/^\s*/)[0].length;
    }

    if (runEnd === start) {
      // Unbalanced markup - leave it untouched and keep scanning.
      output += html.slice(cursor, start + BADGE_OPEN.length);
      cursor = start + BADGE_OPEN.length;
      continue;
    }

    output +=
      html.slice(cursor, start) +
      ROW_OPEN +
      html.slice(start, runEnd) +
      '</div>';
    cursor = runEnd;
  }

  return output + html.slice(cursor);
};

module.exports = { wrapBadgeRuns };
