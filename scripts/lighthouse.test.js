const test = require('ava');
const chromeLauncher = require('chrome-launcher');

// Audits a running site with Lighthouse. It needs a browser and network, so
// it runs only when LIGHTHOUSE_URL is set, for example:
//   LIGHTHOUSE_URL=https://www.ssw.com.au/people/ yarn test
// LIGHTHOUSE_PRESET=desktop uses the desktop preset (default: mobile), and
// LIGHTHOUSE_MIN_SCORE sets the pass mark for every category (default: 0.9).
const url = process.env.LIGHTHOUSE_URL;
const preset = process.env.LIGHTHOUSE_PRESET;
const minScore = Number(process.env.LIGHTHOUSE_MIN_SCORE || 0.9);
const categories = ['performance', 'accessibility', 'best-practices', 'seo'];

const runLighthouse = async () => {
  // Lighthouse 13 is ESM only.
  const { default: lighthouse } = await import('lighthouse');
  const config =
    preset === 'desktop'
      ? (await import('lighthouse/core/config/desktop-config.js')).default
      : undefined;
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new'],
  });
  try {
    const result = await lighthouse(
      url,
      { port: chrome.port, onlyCategories: categories, logLevel: 'error' },
      config
    );
    return result.lhr.categories;
  } finally {
    await chrome.kill();
  }
};

if (!url) {
  test('Lighthouse (set LIGHTHOUSE_URL to run)', (t) => {
    t.log('Skipped: LIGHTHOUSE_URL is not set.');
    t.pass();
  });
} else {
  let scores;
  test.before(async (t) => {
    t.timeout(180000);
    scores = await runLighthouse();
  });

  for (const category of categories) {
    test(`${category} score is at least ${minScore * 100}`, (t) => {
      const { score } = scores[category];
      t.log(`${url}: ${Math.round(score * 100)}`);
      t.true(score >= minScore);
    });
  }
}
