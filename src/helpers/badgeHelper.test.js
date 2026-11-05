const test = require('ava');
const { wrapBadgeRuns } = require('./badgeHelper');

// Mirrors the markup gatsby-remark-custom-blocks and gatsby-remark-images
// produce for an [[imgBadge]] block.
const figure = (src, caption = '') =>
  '<figure><span class="gatsby-resp-image-wrapper">' +
  '<span class="gatsby-resp-image-background-image"></span>' +
  `<img class="gatsby-resp-image-image" alt="generated alt" title="" src="${src}">` +
  `</span><figcaption>${caption}</figcaption></figure>`;

const badge = (...figures) =>
  '<div class="custom-block img-badge"><div class="custom-block-body">' +
  `<p>${figures.join(' ')}</p></div></div>`;

const badgeFile = (file) => `/people/static/abc123/d76be/${file}`;

const count = (html, pattern) => (html.match(pattern) || []).length;
const rows = (html) => count(html, /class="img-badge-row"/g);
const blocks = (html) => count(html, /class="custom-block img-badge"/g);
const names = (html) =>
  [...html.matchAll(/data-badge-name="([^"]*)"/g)].map((match) => match[1]);
const isBalanced = (html) => count(html, /<div\b/g) === count(html, /<\/div>/g);

test('wraps a run of consecutive badges in one row', (t) => {
  const html = [
    badge(figure(badgeFile('Developer-react.png'))),
    badge(figure(badgeFile('Developer-angular.png'))),
    badge(figure(badgeFile('Developer-docker.png'))),
  ].join('\n\n');

  const output = wrapBadgeRuns(html);

  t.is(rows(output), 1);
  t.is(blocks(output), 3);
  t.true(isBalanced(output));
});

test('keeps badges split by other content in separate rows', (t) => {
  const html =
    badge(figure(badgeFile('Developer-react.png'))) +
    '<p>Some text</p>' +
    badge(figure(badgeFile('Developer-angular.png')));

  t.is(rows(wrapBadgeRuns(html)), 2);
});

test('leaves HTML without badges untouched', (t) => {
  const html = '<p>No badges here</p>';

  t.is(wrapBadgeRuns(html), html);
  t.is(wrapBadgeRuns(''), '');
  t.is(wrapBadgeRuns(null), null);
});

test('leaves unbalanced badge markup untouched', (t) => {
  const html = '<div class="custom-block img-badge"><div><p>never closed';

  t.is(wrapBadgeRuns(html), html);
});

test('names a badge from its file name and uses it as the alt text', (t) => {
  const output = wrapBadgeRuns(badge(figure(badgeFile('Developer-react.png'))));

  t.deepEqual(names(output), ['React']);
  t.regex(output, /alt="React"/);
  // The browser's own tooltip would show alongside BadgeTooltip.
  t.regex(output, /title=""/);
});

test('falls back to the caption for a badge with no entry', (t) => {
  const output = wrapBadgeRuns(
    badge(figure(badgeFile('My-own-badge.png'), 'My Own Badge'))
  );

  t.deepEqual(names(output), ['My Own Badge']);
});

test('ignores a caption that is just a file name', (t) => {
  const output = wrapBadgeRuns(
    badge(figure(badgeFile('My-own-badge.png'), 'my-own-badge.png'))
  );

  t.deepEqual(names(output), []);
  t.regex(output, /alt="generated alt"/);
});

test('escapes quotes in a caption', (t) => {
  const output = wrapBadgeRuns(
    badge(figure(badgeFile('My-own-badge.png'), 'The "Best" Badge'))
  );

  t.deepEqual(names(output), ['The &quot;Best&quot; Badge']);
});

test('ignores the content hash gatsby-remark-copy-linked-files adds', (t) => {
  const output = wrapBadgeRuns(
    badge(
      figure(
        '/people/static/Certification-poty-finalist-education-0123456789abcdef0123456789abcdef.svg'
      )
    )
  );

  t.deepEqual(names(output), [
    'Microsoft 2023 Partner of the Year Finalist: Education Award',
  ]);
});

// Rick Su's profile: two images in one [[imgBadge]] block (see #863).
test('gives each image in a multi-image block its own block and name', (t) => {
  const output = wrapBadgeRuns(
    badge(
      figure(
        badgeFile('Certification-scrumalliance-master.png'),
        'Scrum Master'
      ),
      figure(
        badgeFile(
          'Certification-microsoft-azure-database-administrator-associate.png'
        ),
        'Azure Database Administrator Associate'
      )
    )
  );

  t.is(rows(output), 1);
  t.is(blocks(output), 2);
  t.deepEqual(names(output), [
    'Certified ScrumMaster (CSM)',
    'Microsoft Certified: Azure Database Administrator Associate',
  ]);
  t.true(isBalanced(output));
});

test('leaves a single-image block as it was, apart from the name', (t) => {
  const output = wrapBadgeRuns(badge(figure(badgeFile('Developer-react.png'))));

  t.is(blocks(output), 1);
  t.regex(output, /<p><figure>/);
});
