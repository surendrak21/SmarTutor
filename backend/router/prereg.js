const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const Course = require("../model/Course");

// Default catalog (seed)
const DEFAULT_COURSES = [
  { branch: "CSE",  courseId: "CS253",  courseName: "SOFTWARE ENGINEERING AND DEVELOPMENT", credits: 12, time: "T (RM101) W (RM101) F (RM101) 10:00-10:50", instructor: "Dr. Indranil Saha", status: "Active" },
  { branch: "CSE",  courseId: "ESO207", courseName: "DATA STRUCTURES AND ALGORITHMS",        credits: 12, time: "M (L07) W (L07) Th (L07) 12:00-12:50", instructor: "Dr. Nitin Saxena", status: "Active" },
  { branch: "EE",   courseId: "EE698R", courseName: "ADVANCED TOPICS IN MACHINE LEARNING",    credits: 9,  time: "T (L16) Th (L16) 17:15-18:30", instructor: "Dr. Aparna Datt", status: "Active" },
  { branch: "BSBE", courseId: "BSE322A",courseName: "BIOINFORMATICS & COMPUTATIONAL BIOLOGY",  credits: 10, time: "M (L01) Th (L01) 12:00-13:15", instructor: "Dr. Nitin Gupta", status: "Active" },
  { branch: "CSE",  courseId: "CS201A", courseName: "Mathematics for Computerscience I",       credits: 10, time: "M (L01) Th (L01) 07:00-07:50", instructor: "Dr. rajat mittal", status: "Active" },
  { branch: "CSE",  courseId: "CS202M", courseName: "Mathematics for Computerscience II",      credits: 10, time: "M (L01) Th (L01) 07:00-07:50", instructor: "Dr. Mahendra Agrwal", status: "Active" },
  { branch: "CSE",  courseId: "CS203M", courseName: "Mathematics for Computerscience III",     credits: 10, time: "M (L01) Th (L01) 09:00-09:50", instructor: "Dr. Subhajit Roy", status: "Active" },
  { branch: "CSE",  courseId: "CS220A", courseName: "Hardware Development",                    credits: 12, time: "M (L01) Th (L01) 11:00-11:50", instructor: "Dr. Mainak Chaudhry", status: "Active" },
];

async function ensureCatalog() {
  const count = await Course.countDocuments();
  if (count === 0) {
    await Course.insertMany(DEFAULT_COURSES);
  }
}

// ------- Catalog --------

// GET catalog (protected)
router.get("/prereg/catalog", authenticate, async (req, res) => {
  try {
    await ensureCatalog();
    const courses = await Course.find().sort({ courseId: 1 });
    res.json(courses);
  } catch (e) {
    res.status(500).json({ error: "Failed to load catalog" });
  }
});

// NEW: POST single course to catalog (protected)
router.post("/prereg/catalog", authenticate, async (req, res) => {
  try {
    const { branch, courseId, courseName, credits, time, instructor, status } = req.body;
    if (!branch || !courseId || !courseName || !credits || !time || !instructor) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }
    const exists = await Course.findOne({ courseId });
    if (exists) return res.status(409).json({ error: "courseId already exists" });

    const doc = await Course.create({
      branch,
      courseId,
      courseName,
      credits,
      time,
      instructor,
      status: status || "Active",
    });
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: "Failed to add course" });
  }
});

// (Optional) bulk add
router.post("/prereg/catalog/bulk", authenticate, async (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : [];
    if (!items.length) return res.status(400).json({ error: "Array of courses required" });
    await Course.insertMany(items, { ordered: false });
    res.status(201).json({ message: "Bulk insert complete" });
  } catch (e) {
    res.status(500).json({ error: "Bulk insert failed" });
  }
});

// ------- User Selection --------
router.get("/prereg/selection", authenticate, async (req, res) => {
  try {
    const ids = req.rootUser.selectedCourses || [];
    const docs = await Course.find({ courseId: { $in: ids } }).sort({ courseId: 1 });
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: "Failed to load selection" });
  }
});

router.post("/prereg/selection", authenticate, async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ error: "courseId required" });

    const exists = await Course.findOne({ courseId });
    if (!exists) return res.status(404).json({ error: "Course not found in catalog" });

    const sel = req.rootUser.selectedCourses || [];
    if (!sel.includes(courseId)) {
      req.rootUser.selectedCourses = [...sel, courseId];
      await req.rootUser.save();
    }
    res.status(201).json({ message: "Added", courseId });
  } catch (e) {
    res.status(500).json({ error: "Failed to add course" });
  }
});

router.delete("/prereg/selection/:courseId", authenticate, async (req, res) => {
  try {
    const { courseId } = req.params;
    req.rootUser.selectedCourses = (req.rootUser.selectedCourses || []).filter(id => id !== courseId);
    await req.rootUser.save();
    res.json({ message: "Removed", courseId });
  } catch (e) {
    res.status(500).json({ error: "Failed to remove course" });
  }
});

module.exports = router;
