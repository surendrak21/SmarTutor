import React, { useState, useEffect, useMemo } from "react";
import "./PreReg.css";
import { useNavigate } from "react-router-dom";

const DAY_LABEL = {
  M: "Monday",
  T: "Tuesday",
  W: "Wednesday",
  Th: "Thursday",
  F: "Friday",
  SA: "Saturday",
  SN: "Sunday",
};

// build empty timetable grid
function emptyTimetable() {
  const t = {};
  for (let hour = 7; hour <= 18; hour++) {
    const label =
      hour === 12 ? `${hour}:00 pm` : hour > 12 ? `${hour - 12}:00 pm` : `${hour}:00 am`;
    t[label] = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };
  }
  return t;
}

// extract day codes from string like "M (L01) Th (L01) 07:00-07:50"
function parseDays(str) {
  const re = /(Th|SA|SN|M|T|W|F)\b/g;
  const days = [];
  let m;
  while ((m = re.exec(str))) days.push(m[1]);
  return days;
}

// extract start/end hour/min from "10:00-10:50"
function parseTimeRange(str) {
  const m = str.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
  if (!m) return null;
  const startHour = parseInt(m[1], 10);
  const startMin = parseInt(m[2], 10);
  const endHour = parseInt(m[3], 10);
  const endMin = parseInt(m[4], 10);
  return { startHour, startMin, endHour, endMin };
}

const PreRegistration = () => {
  const navigate = useNavigate();

  // all courses from DB (catalog)
  const [catalog, setCatalog] = useState([]);
  // user's selected courses (full docs)
  const [courses, setCourses] = useState([]);
  // search box text
  const [searchTerm, setSearchTerm] = useState("");
  // timetable data
  const [timetable, setTimetable] = useState({});
  // loading state
  const [loading, setLoading] = useState(true);

  // ---------- load auth + catalog + current selection ----------
  useEffect(() => {
    const load = async () => {
      try {
        // auth check
        const authRes = await fetch("/preregistration", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!authRes.ok) throw new Error("Unauthorized");

        // catalog
        const catRes = await fetch("/prereg/catalog", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!catRes.ok) throw new Error("Failed catalog");
        const cat = await catRes.json();
        setCatalog(cat);

        // user's existing selection
        const selRes = await fetch("/prereg/selection", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        if (!selRes.ok) throw new Error("Failed selection");
        const sel = await selRes.json();

        setCourses(sel);
        setLoading(false);
      } catch (err) {
        console.log("PreReg load error:", err);
        if (String(err).toLowerCase().includes("unauthorized")) {
          navigate("/login", { replace: true });
        } else {
          setLoading(false);
          window.alert("Failed to load PreReg data. Please retry.");
        }
      }
    };
    load();
  }, [navigate]);

  // ---------- computed filtered results (shown only when typing) ----------
  const filteredResults = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    // if user hasn't typed at least 2 chars -> return []
    if (term.length < 2) return [];

    return catalog.filter(
      (c) =>
        c.courseName.toLowerCase().includes(term) ||
        c.courseId.toLowerCase().includes(term) ||
        c.branch.toLowerCase().includes(term)
    );
  }, [searchTerm, catalog]);

  // ---------- add course to user's prereg list ----------
  const handleAddCourse = async (course) => {
    try {
      const res = await fetch("/prereg/selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ courseId: course.courseId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        window.alert(data.error || "Failed to add");
        return;
      }
      setCourses((prev) => {
        if (prev.some((c) => c.courseId === course.courseId)) return prev;
        return [...prev, course];
      });
      // optional: clear search after add
      setSearchTerm("");
    } catch (e) {
      console.error(e);
      window.alert("Network error");
    }
  };

  // ---------- remove course from user's prereg list ----------
  const handleDelete = async (courseId) => {
    try {
      const res = await fetch(`/prereg/selection/${courseId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        window.alert(d.error || "Failed to remove");
        return;
      }
      setCourses((prev) => prev.filter((c) => c.courseId !== courseId));
    } catch (e) {
      console.error(e);
      window.alert("Network error");
    }
  };

  // ---------- timetable builder ----------
  useEffect(() => {
    const grid = emptyTimetable();

    courses.forEach((course) => {
      const days = parseDays(course.time);
      const range = parseTimeRange(course.time);
      if (!days.length || !range) return;

      const { startHour, endHour, endMin } = range;

      // fill per-hour slots (10:00-10:50 => only 10)
      const lastHour = endMin > 0 ? endHour : endHour - 1;

      days.forEach((d) => {
        const dayLabel = DAY_LABEL[d];
        if (!dayLabel) return;

        for (let h = startHour; h <= lastHour; h++) {
          const label =
            h === 12 ? `${h}:00 pm` : h > 12 ? `${h - 12}:00 pm` : `${h}:00 am`;
          if (!grid[label]) continue;
          grid[label][dayLabel].push(course.courseId);
        }
      });
    });

    // decorate each cell
    Object.keys(grid).forEach((time) => {
      Object.keys(grid[time]).forEach((day) => {
        const arr = grid[time][day];
        if (Array.isArray(arr)) {
          if (arr.length > 1) {
            grid[time][day] = {
              className: "conflicted",
              courses: arr.join(", "),
            };
          } else if (arr.length === 1) {
            grid[time][day] = {
              className: "highlighted",
              courses: arr[0],
            };
          } else {
            grid[time][day] = { className: "", courses: "" };
          }
        }
      });
    });

    setTimetable(grid);
  }, [courses]);

  if (loading) {
    return (
      <div className="prereg-loading">
        Loading Pre-Registration…
      </div>
    );
  }

  return (
    <div className="prereg-page">
      {/* ---------- SEARCH + RESULTS PANEL ---------- */}
      <section className="search-section">
        <label className="search-label" htmlFor="courseSearch">
          Add course
        </label>

        <input
          id="courseSearch"
          className="search-input"
          type="text"
          placeholder="Search course by name / code (min 2 letters)…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* search dropdown / panel (only when user typed enough and results exist) */}
        {searchTerm.trim().length >= 2 && (
          <div className="search-results-panel">
            {filteredResults.length === 0 ? (
              <div className="search-empty">No matches found</div>
            ) : (
              filteredResults.map((course) => (
                <div
                  key={course.courseId}
                  className="search-row"
                >
<div className="search-row-info">
  <div className="row-top-line">
    <span className="row-name">{course.courseName}</span>

    <span className="row-meta-inline">
      {course.courseId} • {course.branch} • {course.credits} cr
    </span>
  </div>
</div>

                  <button
                    className="row-add-btn"
                    onClick={() => handleAddCourse(course)}
                  >
                    Add
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* ---------- SELECTED COURSES TABLE ---------- */}
      <section className="selection-section">
        <div className="section-head">
          <h2 className="section-title">Your Selection</h2>
          <div className="section-subtitle">
            These will be used for clash check & timetable
          </div>
        </div>

        <div className="table-wrapper">
          <table className="selection-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Branch</th>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Credits</th>
                <th>Time Slot</th>
                <th>Instructor</th>
                <th>Status</th>
                <th>Drop</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course.courseId}>
                  <td>{index + 1}</td>
                  <td>{course.branch}</td>
                  <td>{course.courseId}</td>
                  <td>{course.courseName}</td>
                  <td>{course.credits}</td>
                  <td>{course.time}</td>
                  <td>{course.instructor}</td>
                  <td>{course.status}</td>
                  <td>
                    <button
                      className="drop-btn"
                      onClick={() => handleDelete(course.courseId)}
                    >
                      Drop
                    </button>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr className="table-empty-row">
                  <td colSpan="9" className="table-empty-msg">
                    No courses added yet. Use search above to add.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- TIMETABLE GRID ---------- */}
      <section className="timetable-section">
        <div className="section-head">
          <h2 className="section-title">Your Timetable</h2>
          <div className="section-subtitle">
            Green = OK, Red = clash
          </div>
        </div>

        <div className="table-wrapper">
          <table className="calendar">
            <thead>
              <tr>
                <th>Time / Day</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
                <th>Saturday</th>
                <th>Sunday</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(timetable).map((time) => (
                <tr key={time}>
                  <td>{time}</td>
                  {Object.keys(timetable[time]).map((day) => (
                    <td
                      key={day}
                      className={timetable[time][day].className}
                    >
                      {timetable[time][day].courses}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default PreRegistration;
