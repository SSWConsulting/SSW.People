import React, { useEffect, useState } from "react";
import { FaClock } from "react-icons/fa";
import { formatDistanceStrict } from "date-fns";

function getLastUpdatedTime(isoDate) {
    return formatDistanceStrict(new Date(isoDate), new Date())
        .replace("minute", "min")
        .replace("second", "sec");
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
        if (!author) return;

        let cancelled = false;

        (async () => {
            try {
                setStatus("loading");
                const res = await fetch(
                    `${rulesUrl}/api/rules/last-modified?username=${encodeURIComponent(author)}&limit=${numberOfRules}`,
                    { cache: "no-store" }
                );
                if (!res.ok) throw new Error("Failed to fetch last modified rules");
                const data = await res.json();
                if (!cancelled) {
                    setItems(Array.isArray(data?.items) ? data.items : []);
                    setStatus("success");
                }
            } catch (e) {
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

    const enabled = !!author;
    const moreHref = seeMoreUrl || `${rulesUrl}/user?author=${encodeURIComponent(author || "")}`;

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
                <h4 className="m-0">
                    <a className="no-underline text-gray-800 hover:text-[#cc4141]" target="_blank" rel="noreferrer" href={rulesUrl}>
                        {title}
                    </a>
                </h4>
            </div>

            <div className="border-none text-gray-800 rounded">{content}</div>
        </div>
    );
}
