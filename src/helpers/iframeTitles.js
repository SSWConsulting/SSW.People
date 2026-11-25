// Screen readers announce an iframe by its title. gatsby-remark-embed-video
// writes title="" unless the markdown gives one, so give every iframe in the
// profile HTML a title when it has none.
const titleFor = (tag) =>
  /youtube(-nocookie)?\.com|youtu\.be/.test(tag)
    ? 'YouTube video'
    : 'Embedded content';

const addMissingIframeTitles = (html) => {
  if (!html) return html;
  return html.replace(/<iframe\b[^>]*>/gi, (tag) => {
    if (/\stitle="[^"]*[^"\s][^"]*"/i.test(tag)) return tag;
    const withoutEmpty = tag.replace(/\stitle="\s*"/i, '');
    return withoutEmpty.replace(
      /^<iframe\b/i,
      `<iframe title="${titleFor(tag)}"`
    );
  });
};

module.exports = { addMissingIframeTitles };
