import React, { useState, useEffect } from 'react';
import "./PreReg.css";

const PreRegistration = () => {
  const initialCourses = [
    // Your initial courses array, including examples provided
    { id: 1, branch: 'CSE', courseId: 'CS253', courseName: 'SOFTWARE ENGINEERING AND DEVELOPMENT', credits: 12, time: 'T (RM101) W (RM101) F (RM101) 10:00-10:50', instructor: 'Dr. Indranil Saha', status: 'Active' },
    { id: 2, branch: 'CSE', courseId: 'ESO207', courseName: 'DATA STRUCTURES AND ALGORITHMS', credits: 12, time: 'M (L07) W (L07) Th (L07) 12:00-12:50', instructor: 'Dr. Nitin Saxena', status: 'Active' },
    { id: 3, branch: 'EE ', courseId: 'EE698R', courseName: 'ADVANCED TOPICS IN MACHINE LEARNING', credits: 9, time: 'T (L16) Th (L16) 17:15-18:30', instructor: 'Dr. Aparna Datt', status: 'Active' },
    { id: 4, branch: 'BSBE', courseId: 'BSE322A', courseName: 'BIOINFORMATICS & COMPUTATIONAL BIOLOGY', credits: 10, time: 'M (L01) Th (L01) 12:00-13:15', instructor: 'Dr. Nitin Gupta', status: 'Active' },
    // Add your remaining initial courses here
    { id: 5, branch: 'CSE', courseId: 'CS201A', courseName: 'Mathematics for Computerscience I', credits: 10, time: 'M (L01) Th (L01) 07:00-07:50', instructor: 'Dr. rajat mittal', status: 'Active' },
    { id: 6, branch: 'CSE', courseId: 'CS202M', courseName: 'Mathematics for Computerscience II', credits: 10, time: 'M (L01) Th (L01) 07:00-07:50', instructor: 'Dr. Mahendra Agrwal', status: 'Active' },
    { id: 7, branch: 'CSE', courseId: 'CS203M', courseName: 'Mathematics for Computerscience III', credits: 10, time: 'M (L01) Th (L01) 09:00-09:50', instructor: 'Dr. Subhajit Roy', status: 'Active' },
    { id: 8, branch: 'CSE', courseId: 'CS220A', courseName: 'Hardware Development', credits: 12, time: 'M (L01) Th (L01) 11:00-11:50', instructor: 'Dr. Mainak Chaudhry', status: 'Active' },
  ];

  const [courses, setCourses] = useState(initialCourses);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [timetable, setTimetable] = useState({}); // Define timetable state

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    const results = initialCourses.filter(course =>
      course.courseName.toLowerCase().includes(value.toLowerCase()) ||
      course.courseId.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleAddCourse = (course) => {
    if (!courses.some(c => c.id === course.id)) {
      setCourses([...courses, course]);
    }
  };

  const handleDelete = (id) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  // Timetable generation with conflict detection
  useEffect(() => {
    const updateTimetable = () => {
      const dayMappings = { M: 'Monday', T: 'Tuesday', W: 'Wednesday', Th: 'Thursday', F: 'Friday' ,SA:'Saturday',SN :'Sunday'};
      let newTimetable = {};

      for (let hour = 7; hour <= 18; hour++) {
        let time = '';
        if (hour === 12) {
          time = `${hour}:00 pm`;
        } else if (hour > 12) {
          time = `${hour - 12}:00 pm`;
        } else {
          time = `${hour}:00 am`;
        }
        newTimetable[time] = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [],Saturday: [], Sunday:[] };
      }

      courses.forEach(course => {
        const regex = /([MTWThF]+) \(\w+\) (\d{2}):(\d{2})-(\d{2}):(\d{2})/;
        const match = course.time.match(regex);
        if (match) {
          const days = match[1];
          const startHour = parseInt(match[2], 10);
          const endHour = parseInt(match[4], 10);

          Object.keys(dayMappings).forEach(key => {
            if (days.includes(key)) {
              for (let hour = startHour; hour <= endHour; hour++) {
                let time = '';
                if (hour === 12) {
                  time = `${hour}:00 pm`;
                } else if (hour > 12) {
                  time = `${hour - 12}:00 pm`;
                } else {
                  time = `${hour}:00 am`;
                }
                newTimetable[time][dayMappings[key]].push(course.courseId);
              }
            }
          });
        }
      });

      // Set cell class based on conflicts
      Object.keys(newTimetable).forEach(time => {
        Object.keys(newTimetable[time]).forEach(day => {
          if (newTimetable[time][day].length > 1) {
            // Conflict detected
            newTimetable[time][day] = { className: 'conflicted', courses: newTimetable[time][day].join(", ") };
          } else if (newTimetable[time][day].length === 1) {
            // Single course
            newTimetable[time][day] = { className: 'highlighted', courses: newTimetable[time][day][0] };
          } else {
            // No courses
            newTimetable[time][day] = { className: '', courses: '' };
          }
        });
      });

      return newTimetable;
    };

    setTimetable(updateTimetable());
  }, [courses]);

  return (
    <>
      {/* Existing UI for course search, add, and selection */}
      <div className="course-search">
        <input
          type="text"
          placeholder="Search courses by name or ID..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchResults.map(course => (
          <div key={course.id} className="search-result">
            {course.courseName} ({course.courseId})
            <button onClick={() => handleAddCourse(course)}>Add</button>
          </div>
        ))}
      </div>


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
              <tr key={course.id}>
                <td>{index + 1}</td>
                <td>{course.branch}</td>
                <td>{course.courseId}</td>
                <td>{course.courseName}</td>
                <td>{course.credits}</td>
                <td>{course.time}</td>
                <td>{course.instructor}</td>
                <td>{course.status}</td>
                <td><button onClick={() => handleDelete(course.id)}>Drop</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            {Object.keys(timetable).map(time => (
              <tr key={time}>
                <td>{time}</td>
                {Object.keys(timetable[time]).map(day => (
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