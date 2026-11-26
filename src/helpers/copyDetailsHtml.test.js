const test = require('ava');
const { buildCopyDetailsHtml } = require('./copyDetailsHtml');

const profile = {
  fullName: 'Bob Northwind',
  jobTitle: 'Solution Architect',
  slug: 'bob-northwind',
  billingRate: 200,
  imageUrl: 'https://www.ssw.com.au/people/static/bob.jpg',
};

const textOf = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

test('includes the job title between the name and the hourly rates', (t) => {
  const text = textOf(buildCopyDetailsHtml(profile));
  const name = text.indexOf('Bob Northwind');
  const title = text.indexOf('Solution Architect');
  const rates = text.indexOf('Hourly Rates');
  t.true(name >= 0 && name < title && title < rates);
});

test('shows standard and prepaid rates', (t) => {
  const text = textOf(buildCopyDetailsHtml(profile));
  t.true(text.includes('Standard: $200+GST'));
  t.true(text.includes('Prepaid: $185+GST'));
});

test('leaves out the title line when there is no job title', (t) => {
  const html = buildCopyDetailsHtml({ ...profile, jobTitle: '  ' });
  t.regex(html, /<\/a><br>\s*Hourly Rates:/);
});

test('escapes HTML in the name and title', (t) => {
  const html = buildCopyDetailsHtml({
    ...profile,
    fullName: 'A <b>',
    jobTitle: 'R&D "Lead"',
  });
  t.true(html.includes('A &lt;b&gt;'));
  t.true(html.includes('R&amp;D &quot;Lead&quot;'));
  t.false(html.includes('<b>'));
});
