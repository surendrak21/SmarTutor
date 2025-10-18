import React, { useMemo, useState } from "react";
import {
  FaBullhorn,
  FaSearch,
  FaThumbtack,
  FaTag,
  FaSortAmountDown,
} from "react-icons/fa";
import "./Announcement.css";

const seed = [
  {
    id: "a1",
    title: "Important Announcement",
    body:
      "Pre-registration window opens next week. Please verify pre-requisites and keep your shortlist ready. Late changes may not be accommodated.",
    date: "2024-03-14",
    tags: ["PreReg", "Important"],
    pinned: true,
  },
  {
    id: "a2",
    title: "Update on Schedule",
    body:
      "Lecture slots for CS253 and ESO207 have been adjusted to reduce clashes. Check the catalog and regenerate timetable.",
    date: "2024-03-10",
    tags: ["Timetable", "CS"],
    pinned: false,
  },
  {
    id: "a3",
    title: "Maintenance Notice",
    body:
      "SmartTutor will be unavailable on Saturday 10:00–12:00 for routine maintenance. Save your selections in advance.",
    date: "2024-03-08",
    tags: ["System"],
    pinned: false,
  },
];

/**
 * If/when you connect real backend:
 *  - replace `seed` with fetched data
 *  - keep the same shape {id,title,body,date,tags[],pinned}
 */

export default function Announcement() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");
  const [sort, setSort] = useState("new"); // new | old | pinned

  const tags = useMemo(() => {
    const t = new Set(seed.flatMap((a) => a.tags));
    return ["All", ...Array.from(t)];
  }, []);

  const data = useMemo(() => {
    let list = [...seed];

    // search
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.body.toLowerCase().includes(q) ||
          a.tags.join(" ").toLowerCase().includes(q)
      );
    }

    // tag filter
    if (tag !== "All") list = list.filter((a) => a.tags.includes(tag));

    // sort
    if (sort === "new") list.sort((a, b) => (a.date < b.date ? 1 : -1));
    if (sort === "old") list.sort((a, b) => (a.date > b.date ? 1 : -1));
    if (sort === "pinned")
      list.sort((a, b) => Number(b.pinned) - Number(a.pinned));

    return list;
  }, [query, tag, sort]);

  return (
    <div className="ann">
      <header className="ann__hero">
        <div className="ann__icon">
          <FaBullhorn />
        </div>
        <div>
          <h1>Announcements</h1>
          <p className="muted">
            Stay in sync with prereg timelines, timetable updates, and system notices.
          </p>
        </div>
      </header>

      {/* Controls */}
      <div className="ann__controls container">
        <div className="ann__search">
          <FaSearch />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search announcements, tags, keywords…"
          />
        </div>

        <div className="ann__right">
          <div className="ann__select">
            <FaTag />
            <select value={tag} onChange={(e) => setTag(e.target.value)}>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="ann__select">
            <FaSortAmountDown />
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
              <option value="pinned">Pinned on top</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="container ann__list">
        {data.length === 0 ? (
          <div className="ann__empty">
            No announcements found. Try a different search or tag.
          </div>
        ) : (
          data.map((a) => (
            <article className="ann__card" key={a.id}>
              <div className="ann__card__head">
                <h3>{a.title}</h3>
                {a.pinned && (
                  <span className="ann__pin" title="Pinned">
                    <FaThumbtack />
                  </span>
                )}
              </div>

              <p className="ann__body">{a.body}</p>

              <div className="ann__meta">
                <time dateTime={a.date}>
                  {new Date(a.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "2-digit",
                  })}
                </time>
                <div className="ann__tags">
                  {a.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
