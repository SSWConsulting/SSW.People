import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { formatDistanceStrict } from "date-fns";

const PEOPLE_LATEST_RULES_URL =
    "https://www.ssw.com.au/rules/people-latest-rules.json";
const PEOPLE_LATEST_RULES_DEV_PROXY_PATH = "/__rules/people-latest-rules.json";

function getLastUpdatedTime(isoDate) {
    return formatDistanceStrict(new Date(isoDate), new Date())
        .replace("minute", "min")
        .replace("second", "sec");
}

function normalizeAuthor(author) {
    if (!author) return "";
    const raw = String(author).trim();
    if (!raw) return "";

    // If a full URL was passed, extract last path segment
    try {
        const u = new URL(raw);
        const last = u.pathname.split("/").filter(Boolean).pop();
        return (last || "").trim();
    } catch { }

    return raw
        .replace(/^@/, "")
        .split("?")[0]
        .split("#")[0]
        .replace(/\/+$/, "")
        .trim();
}

function pickRulesForAuthor(data, author) {
    if (!data || typeof data !== "object") return [];

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
    rulesUrl = "https://www.ssw.com.au/rules",
    seeMoreUrl,
    title = "Latest Rules",
}) {
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState("idle"); // idle | loading | error | success

    useEffect(() => {
        const normalizedAuthor = normalizeAuthor(author);
        if (!normalizedAuthor) return;

        let cancelled = false;

        (async () => {
            try {
                setStatus("loading");
                const jsonUrl =
                    process.env.NODE_ENV === "development"
                        ? PEOPLE_LATEST_RULES_DEV_PROXY_PATH
                        : PEOPLE_LATEST_RULES_URL;
                const res = await fetch(jsonUrl, { cache: "no-store" });
                if (!res.ok) throw new Error("Failed to fetch people latest rules JSON");
                const data = await res.json();

                const rawItems = pickRulesForAuthor(data, normalizedAuthor);
                const toTime = (x) => (x?.lastModifiedAt ? Date.parse(x.lastModifiedAt) || 0 : 0);
                const filtered = rawItems
                    .filter((x) => x && x.title && x.uri)
                    // newest first (JSON is expected to already be latest, but keep deterministic)
                    .sort((a, b) => toTime(b) - toTime(a))
                    .slice(0, numberOfRules);

                if (!cancelled) {
                    setItems(filtered);
                    setStatus("success");
                }
            } catch {
                if (!cancelled) {
                    setItems([]);
                    setStatus("error");
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [author, numberOfRules]);

    const normalizedAuthor = normalizeAuthor(author);
    const enabled = !!normalizedAuthor;
    const moreHref = seeMoreUrl || `${rulesUrl}/user?author=${encodeURIComponent(normalizedAuthor || "")}`;

    const content = (() => {
        if (!enabled) return <p className="text-center text-sm text-gray-600">No Rules Found</p>;
        if (status === "loading") return <p className="text-center text-sm text-gray-600">Loading...</p>;
        if (status === "error") return <p className="text-center text-sm text-gray-600">No Rules Found</p>;
        if (!items.length) return <p className="text-center text-sm text-gray-600">No Rules Found</p>;

        return (
            <>
                {items.map((item, idx) => (
                    <a
                        key={`${item.uri}-${idx}`}
                        href={`${rulesUrl}/${item.uri}`}
                        target="_blank"
                        rel="noreferrer"
                        className="block no-underline text-gray-800 hover:text-[#cc4141]"
                    >
                        <div className="my-2.5 p-3 bg-[#f5f5f5] border-l-2 border-l-[#cc4141] text-left transition-shadow hover:shadow-md">
                            <p className="text-base text-gray-800 leading-[1.2] break-words mb-1">
                                {item.title}
                            </p>

                            <p className="text-[#aaa] flex items-center gap-1 text-sm">
                                <span className="inline-flex items-start">
                                    <FaClock size={14} />
                                </span>
                                {item.lastModifiedAt ? `${getLastUpdatedTime(item.lastModifiedAt)} ago` : "—"}
                            </p>
                        </div>
                    </a>
                ))}

                <div className="text-center leading-[0.8] p-3">
                    <a className="text-base text-[#cc4141] underline" target="_blank" rel="noreferrer" href={moreHref}>
                        See more
                    </a>
                </div>
            </>
        );
    })();

    return (
        <div className="text-base">
            <div className="flex flex-col items-center">
                <h4 className="mt-8">
                    <a className="no-underline hover:text-[#cc4141]" target="_blank" rel="noreferrer" href={rulesUrl}>
                        {title}
                    </a>
                </h4>
            </div>

            <div>{content}</div>
        </div>
    );
}
