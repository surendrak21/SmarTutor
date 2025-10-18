// backend/model/Course.js
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    branch: { type: String, required: true },
    courseId: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    credits: { type: Number, required: true },
    time: { type: String, required: true },
    instructor: { type: String, required: true },
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
