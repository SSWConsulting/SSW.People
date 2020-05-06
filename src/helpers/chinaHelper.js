const isChinaBuild = process.env.CHINA_BUILD && process.env.CHINA_BUILD;

const cleanHtml = html => {
  var cleaned = html;
  // remove the embedded Youtube videos
  cleaned = cleaned.replace(
    /<div class="gatsby-resp-iframe-wrapper"(.*?)<\/div>/,
    ''
  );

  return cleaned;
};

export { cleanHtml, isChinaBuild };
