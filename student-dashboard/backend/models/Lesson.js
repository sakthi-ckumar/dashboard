const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    durationMinutes: { type: Number, default: 30 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lesson", lessonSchema);
