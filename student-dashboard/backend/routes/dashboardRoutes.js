const express = require("express");
const mongoose = require("mongoose");
const Activity = require("../models/Activity");
const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const toObjectId = (id) => mongoose.Types.ObjectId.createFromHexString(id);

router.get("/summary", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const completedLessons = await Activity.countDocuments({ userId, completed: true });

    const totalTime = await Activity.aggregate([
      { $match: { userId: toObjectId(userId) } },
      { $group: { _id: null, totalTimeSpent: { $sum: "$timeSpentMinutes" } } }
    ]);

    const courseProgress = await Activity.aggregate([
      { $match: { userId: toObjectId(userId) } },
      {
        $group: {
          _id: "$courseId",
          completedCount: { $sum: { $cond: ["$completed", 1, 0] } },
          totalTimeSpent: { $sum: "$timeSpentMinutes" }
        }
      },
      { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
      { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          completedCount: 1,
          totalTimeSpent: 1,
          course: { title: { $ifNull: ["$course.title", "Unknown"] } }
        }
      }
    ]);

    res.json({
      completedLessons,
      totalTimeSpent: totalTime[0]?.totalTimeSpent || 0,
      courseProgress
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard summary", error: error.message });
  }
});

router.get("/trend", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const trendData = await Activity.aggregate([
      { $match: { userId: toObjectId(userId) } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$activityDate" } },
          timeSpent: { $sum: "$timeSpentMinutes" },
          completedLessons: { $sum: { $cond: ["$completed", 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(trendData);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trend data", error: error.message });
  }
});

router.get("/lessons", protect, async (req, res) => {
  try {
    const lessons = await Lesson.find().populate("courseId");
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch lessons", error: error.message });
  }
});

router.get("/recommendations", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const activities = await Activity.find({ userId, completed: true }).populate("courseId lessonId");

    let recommendation = "Continue your current learning path.";

    if (activities.length < 3) {
      recommendation = "Complete at least 3 lessons to improve your learning progress.";
    } else {
      recommendation = "Great progress. Start the next advanced course module.";
    }

    res.json({ recommendation });
  } catch (error) {
    res.status(500).json({ message: "Failed to generate recommendation", error: error.message });
  }
});

module.exports = router;
