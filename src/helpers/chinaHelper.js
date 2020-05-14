const isChinaBuild =
  process.env.CHINA_BUILD && process.env.CHINA_BUILD === 'TRUE';

const cleanHtml = html => {
  var cleaned = html;
  // remove the embedded Youtube videos
  cleaned = cleaned.replace(
    /<div class="gatsby-resp-iframe-wrapper"(.*?)<div class="embedVideo-container">(.*?)<iframe src="https:\/\/www.youtube(.*?)<\/div> <\/div>/g,
    ''
  );

  cleaned = cleaned.replace(
    /<div class="gatsby-resp-iframe-wrapper"(.*?)<iframe src="https:\/\/www.youtube(.*?)<\/div>/,
    ''
  );

  return cleaned;
};

module.exports = { isChinaBuild, cleanHtml };
