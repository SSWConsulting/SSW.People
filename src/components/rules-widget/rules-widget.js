import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faClock } from '@fortawesome/free-solid-svg-icons';
import {
  differenceInMonths,
  differenceInYears,
  formatDistanceStrict,
} from 'date-fns';

const PEOPLE_LATEST_RULES_URL =
  'https://www.ssw.com.au/rules/people-latest-rules.json';
const PEOPLE_LATEST_RULES_DEV_PROXY_PATH = '/__rules/people-latest-rules.json';

// formatDistanceStrict rounds to the nearest unit, so 46 days reads as
// '2 months' and 18 months reads as '2 years'. Count whole calendar months and
// years instead, and leave anything under a month to date-fns.
function getLastUpdatedTime(isoDate) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return null;

  const now = new Date();

  const years = differenceInYears(now, date);
  if (years >= 1) return `${years} year${years === 1 ? '' : 's'}`;

  const months = differenceInMonths(now, date);
  if (months >= 1) return `${months} month${months === 1 ? '' : 's'}`;

  return formatDistanceStrict(date, now)
    .replace('minute', 'min')
    .replace('second', 'sec');
}

function normalizeAuthor(author) {
  if (!author) return '';
  const raw = String(author).trim();
  if (!raw) return '';

  // If a full URL was passed, extract last path segment
  try {
    const u = new URL(raw);
    const last = u.pathname.split('/').filter(Boolean).pop();
    return (last || '').trim();
  } catch {
    // not a URL - fall through and treat it as a username
  }

  return raw
    .replace(/^@/, '')
    .split('?')[0]
    .split('#')[0]
    .replace(/\/+$/, '')
    .trim();
}

function pickRulesForAuthor(data, author) {
  if (!data || typeof data !== 'object') return [];

  const a = normalizeAuthor(author);
  if (!a) return [];

  const candidates = [
    // JSON keys are expected to be encodeURIComponent(author), but try both to be resilient
    encodeURIComponent(a),
    encodeURIComponent(a.toLowerCase()),
    a,
    a.toLowerCase(),
  ];

  for (const key of candidates) {
    const arr = data?.[key];
    if (Array.isArray(arr)) return arr;
  }

  return [];
}

export default function RulesWidget({
  numberOfRules = 5,
  author,
  rulesUrl = 'https://www.ssw.com.au/rules',
  seeMoreUrl,
  title = 'Latest Rules',
}) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | error | success

  useEffect(() => {
    const normalizedAuthor = normalizeAuthor(author);
    if (!normalizedAuthor) return;

    let cancelled = false;

    (async () => {
      try {
        setStatus('loading');
        const jsonUrl =
          process.env.NODE_ENV === 'development'
            ? PEOPLE_LATEST_RULES_DEV_PROXY_PATH
            : PEOPLE_LATEST_RULES_URL;
        const res = await fetch(jsonUrl, { cache: 'no-store' });
        if (!res.ok)
          throw new Error('Failed to fetch people latest rules JSON');
        const data = await res.json();

        const rawItems = pickRulesForAuthor(data, normalizedAuthor);
        const toTime = (x) =>
          x?.lastModifiedAt ? Date.parse(x.lastModifiedAt) || 0 : 0;
        const filtered = rawItems
          .filter((x) => x && x.title && x.uri)
          // newest first (JSON is expected to already be latest, but keep deterministic)
          .sort((a, b) => toTime(b) - toTime(a))
          .slice(0, numberOfRules);

        if (!cancelled) {
          setItems(filtered);
          setStatus('success');
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setStatus('error');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [author, numberOfRules]);

  const normalizedAuthor = normalizeAuthor(author);
  const enabled = !!normalizedAuthor;
  const moreHref =
    seeMoreUrl ||
    `${rulesUrl}/user?author=${encodeURIComponent(normalizedAuthor || '')}`;

  const content = (() => {
    if (!enabled) return <p className="text-sm text-weak">No Rules Found</p>;
    if (status === 'loading')
      return <p className="text-sm text-weak">Loading...</p>;
    if (status === 'error')
      return <p className="text-sm text-weak">No Rules Found</p>;
    if (!items.length)
      return <p className="text-sm text-weak">No Rules Found</p>;

    return (
      <>
        <ul className="m-0 p-0 list-none">
          {items.map((item, idx) => {
            const lastUpdated = getLastUpdatedTime(item.lastModifiedAt);

            return (
              <li key={`${item.uri}-${idx}`} className="mb-5">
                <a
                  href={`${rulesUrl}/${item.uri}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm font-medium text-strong no-underline break-words hover:text-ssw-red"
                >
                  {item.title}
                </a>
                <p className="flex items-center gap-1 mt-1 text-xs text-weak">
                  <FontAwesomeIcon icon={faClock} />
                  {lastUpdated ? `${lastUpdated} ago` : '—'}
                </p>
              </li>
            );
          })}
        </ul>

        {/* Styled like the Edit link in the profile header. */}
        <a
          className="inline-flex items-center text-sm text-strong underline hover:text-ssw-red"
          target="_blank"
          rel="noreferrer"
          href={moreHref}
        >
          See more
          <FontAwesomeIcon icon={faArrowRight} className="ml-2" />
        </a>
      </>
    );
  })();

  // Matches the sidebar cards on the SSW Rules site (www.ssw.com.au/rules).
  return (
    <div className="mt-4 p-4 bg-white border border-[#cfcfcf] rounded-md">
      <h4 className="mt-0 mb-4 text-lg font-semibold">
        <a
          className="text-strong no-underline hover:text-ssw-red"
          target="_blank"
          rel="noreferrer"
          href={rulesUrl}
        >
          {title}
        </a>
      </h4>

      {content}
    </div>
  );
}

RulesWidget.propTypes = {
  numberOfRules: PropTypes.number,
  author: PropTypes.string,
  rulesUrl: PropTypes.string,
  seeMoreUrl: PropTypes.string,
  title: PropTypes.string,
};
