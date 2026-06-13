const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    completed: { type: Boolean, default: false },
    timeSpentMinutes: { type: Number, default: 0 },
    activityDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
