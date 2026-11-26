const test = require('ava');
const { addMissingIframeTitles } = require('./iframeTitles');

const youtube =
  '<iframe title="" src="https://www.youtube-nocookie.com/embed/abc?rel=0" class="embedVideo-iframe"></iframe>';

test('gives an empty-titled YouTube embed a title', (t) => {
  t.is(
    addMissingIframeTitles(youtube),
    '<iframe title="YouTube video" src="https://www.youtube-nocookie.com/embed/abc?rel=0" class="embedVideo-iframe"></iframe>'
  );
});

test('gives an iframe with no title attribute a generic title', (t) => {
  t.is(
    addMissingIframeTitles('<iframe src="https://example.com/x"></iframe>'),
    '<iframe title="Embedded content" src="https://example.com/x"></iframe>'
  );
});

test('keeps a title the author wrote', (t) => {
  const html = youtube.replace('title=""', 'title="My talk"');
  t.is(addMissingIframeTitles(html), html);
});

test('leaves HTML without iframes and empty input alone', (t) => {
  t.is(addMissingIframeTitles('<p>Hi</p>'), '<p>Hi</p>');
  t.is(addMissingIframeTitles(''), '');
  t.is(addMissingIframeTitles(undefined), undefined);
});
