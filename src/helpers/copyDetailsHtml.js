const PREPAID_DISCOUNT = 15;

const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

// The "at-a-glance" table that Copy Details puts on the clipboard. People
// paste it into Word and email, so it uses plain inline-styled HTML.
const buildCopyDetailsHtml = ({
  fullName,
  jobTitle,
  slug,
  billingRate,
  imageUrl,
}) => {
  const name = escapeHtml(fullName);
  const title = jobTitle?.trim()
    ? `\n          ${escapeHtml(jobTitle.trim())}<br>`
    : '';

  return `
    <table border="0" cellspacing="0" cellpadding="0" style="width: auto;">
      <tr>
        <td>
          <img src="${imageUrl}" alt="${name}'s profile picture" height="90">
        </td>
        <td style="vertical-align: top; padding-left: 5px;">
          <strong style="text-transform: uppercase;">${name}</strong> | <a href="https://www.ssw.com.au/people/${slug}">ssw.com.au/people/${slug}</a><br>${title}
          Hourly Rates:
          <ul style="margin-top: 0; padding-left: 20px; padding-top: 0;">
            <li style="margin-top: 0;">Standard: $${billingRate}+GST</li>
            <li>Prepaid: $${
              billingRate - PREPAID_DISCOUNT
            }+GST (minimum 40h, subject to <a href="https://www.ssw.com.au/terms-and-conditions">prepaid terms</a>)</li>

          </ul>
        </td>
      </tr>
    </table>
    `;
};

module.exports = { buildCopyDetailsHtml };
