const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const User = require("./models/User");
const Course = require("./models/Course");
const Lesson = require("./models/Lesson");
const Activity = require("./models/Activity");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany();
    await Course.deleteMany();
    await Lesson.deleteMany();
    await Activity.deleteMany();

    const password = await bcrypt.hash("123456", 10);

    const student = await User.create({
      name: "Sakthi",
      email: "student@example.com",
      password,
      role: "student"
    });

    await User.create({
      name: "Mentor",
      email: "mentor@example.com",
      password,
      role: "mentor"
    });

    const reactCourse = await Course.create({
      title: "React.js Fundamentals",
      description: "Learn React components, hooks, routing, and state management"
    });

    const nodeCourse = await Course.create({
      title: "Node.js Backend",
      description: "Learn backend APIs, authentication, and MongoDB"
    });

    const lesson1 = await Lesson.create({ courseId: reactCourse._id, title: "React Components", durationMinutes: 40 });
    const lesson2 = await Lesson.create({ courseId: reactCourse._id, title: "React Hooks", durationMinutes: 50 });
    const lesson3 = await Lesson.create({ courseId: nodeCourse._id, title: "Express REST APIs", durationMinutes: 60 });

    await Activity.create([
      {
        userId: student._id,
        courseId: reactCourse._id,
        lessonId: lesson1._id,
        completed: true,
        timeSpentMinutes: 40,
        activityDate: new Date("2026-06-01")
      },
      {
        userId: student._id,
        courseId: reactCourse._id,
        lessonId: lesson2._id,
        completed: true,
        timeSpentMinutes: 50,
        activityDate: new Date("2026-06-02")
      },
      {
        userId: student._id,
        courseId: nodeCourse._id,
        lessonId: lesson3._id,
        completed: false,
        timeSpentMinutes: 25,
        activityDate: new Date("2026-06-03")
      }
    ]);

    console.log("Seed data inserted successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
