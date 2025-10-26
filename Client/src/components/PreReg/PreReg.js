import React, { useState, useEffect } from "react";
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


// IMPORTANT: keep Th, SA, SN before single-letter days to avoid T catching "Th"
function parseDays(str) {
  const re = /(Th|SA|SN|M|T|W|F)\b/g;
  const days = [];
  let m;
  while ((m = re.exec(str))) days.push(m[1]);
  return days;
}

// parse single time range (10:00-10:50 etc.)
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

  const [catalog, setCatalog] = useState([]); // all courses from DB
  const [courses, setCourses] = useState([]); // user's selected courses (expanded docs)
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);

  // ---------- Auth check + Load catalog + selection ----------
  useEffect(() => {
    const load = async () => {
      try {
        const authRes = await fetch("/preregistration", {
          method: "GET",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!authRes.ok) throw new Error("Unauthorized");

        const catRes = await fetch("/prereg/catalog", {
          method: "GET",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!catRes.ok) throw new Error("Failed catalog");
        const cat = await catRes.json();
        setCatalog(cat);

        const selRes = await fetch("/prereg/selection", {
          method: "GET",
          headers: { Accept: "application/json", "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!selRes.ok) throw new Error("Failed selection");
        const sel = await selRes.json();

        setCourses(sel);
        setSearchResults(cat);
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

  // Search filter (on catalog)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults(catalog);
      return;
    }
    const term = searchTerm.toLowerCase();
    setSearchResults(
      catalog.filter(
        (c) =>
          c.courseName.toLowerCase().includes(term) ||
          c.courseId.toLowerCase().includes(term) ||
          c.branch.toLowerCase().includes(term)
      )
    );
  }, [searchTerm, catalog]);

  // Add to user's selection
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
    } catch (e) {
      console.error(e);
      window.alert("Network error");
    }
  };

  // Remove from user's selection
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

  // Timetable generation with conflict detection (from selected courses)
  useEffect(() => {
    const t = emptyTimetable();

    courses.forEach((course) => {
      const days = parseDays(course.time);            // e.g. ["M","Th"]
      const range = parseTimeRange(course.time);      // e.g. {startHour:12,endHour:13,...}
      if (!days.length || !range) return;

      const { startHour, startMin, endHour, endMin } = range;

      // hour slots to fill (inclusive if endMin>0 so 10:00-10:50 => hour 10 only)
      const lastHour = endMin > 0 ? endHour : endHour - 1;

      days.forEach((d) => {
        const dayLabel = DAY_LABEL[d];
        if (!dayLabel) return;

        for (let h = startHour; h <= lastHour; h++) {
          const label =
            h === 12 ? `${h}:00 pm` : h > 12 ? `${h - 12}:00 pm` : `${h}:00 am`;
          if (!t[label]) continue;
          t[label][dayLabel].push(course.courseId);
        }
      });
    });

    // decorate cells
    Object.keys(t).forEach((time) => {
      Object.keys(t[time]).forEach((day) => {
        const arr = t[time][day];
        if (Array.isArray(arr)) {
          if (arr.length > 1) t[time][day] = { className: "conflicted", courses: arr.join(", ") };
          else if (arr.length === 1) t[time][day] = { className: "highlighted", courses: arr[0] };
          else t[time][day] = { className: "", courses: "" };
        }
      });
    });

    setTimetable(t);
  }, [courses]);

  if (loading) return <div style={{ padding: 16 }}>Loading Pre-Registration…</div>;

  return (
    <>
      {/* Search (Catalog) */}
      <div className="course-search">
        <input
          type="text"
          placeholder="Search courses by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchResults.map((course) => (
          <div key={course.courseId} className="search-result">
            {course.courseName} ({course.courseId})
            <button onClick={() => handleAddCourse(course)}>Add</button>
          </div>
        ))}
      </div>

      {/* Selected Courses (User) */}
      <div className="selected-courses">
        <h2>Selected Courses</h2>
        <table>
          <thead>
            <tr>
              <th>S.No</th>
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
                  <button onClick={() => handleDelete(course.courseId)}>Drop</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Timetable */}
      <div className="content">
        <table className="calendar">
          <thead>
            <tr>
              <th>Time/Day</th>
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
                  <td key={day} className={timetable[time][day].className}>
                    {timetable[time][day].courses}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default PreRegistration;
