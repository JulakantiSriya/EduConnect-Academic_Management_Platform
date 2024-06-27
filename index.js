const express = require("express");
const mongoose = require("mongoose");

const app = express(); // creates an instance
const PORT = 8001;
const cors = require("cors");

//connection
mongoose
  .connect("mongodb://127.0.0.1:27017/plms")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo Error", err));

app.use(
  cors({
    origin: "http://127.0.0.1:5501", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow only GET and POST requests
    allowedHeaders: ["Content-Type", "Authorization"], // Allow only these headers
  })
);
app.use(express.json({ limit: "10mb" })); // Adjust limit as needed

//Schema
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // if first name not given then we wont accept the data
    },
    registrationNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true, //same email shaouldnot be in database multiple time//chcks same entry doesnt exist
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    degree: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const teacherSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // if first name not given then we wont accept the data
    },
    registrationNumber: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true, //same email shaouldnot be in database multiple time//chcks same entry doesnt exist
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    courseCode: {
      type: String,
      required: true,
    },

    sections: [
      {
        type: String,
        required: true,
      },
    ],
    //array ani suare brackets

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const meetingSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Types.ObjectId,
      ref: "teachers", // collection
      required: true, // if first name not given then we wont accept the data
    },
    student: {
      type: mongoose.Types.ObjectId,
      ref: "students",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const midMarksSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Types.ObjectId,
      ref: "teachers", // collection
      required: true, // if first name not given then we wont accept the data
    },
    student: {
      type: mongoose.Types.ObjectId,
      ref: "students",
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },

    marks: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const assignmentMarksSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Types.ObjectId,
      ref: "teachers", // collection
      required: true, // if first name not given then we wont accept the data
    },
    student: {
      type: mongoose.Types.ObjectId,
      ref: "students",
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const quizMarksSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Types.ObjectId,
      ref: "teachers", // collection
      required: true, // if first name not given then we wont accept the data
    },
    student: {
      type: mongoose.Types.ObjectId,
      ref: "students",
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    courseCode: {
      type: String,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

//model
const Student = mongoose.model("students", studentSchema); //using user we can interact with mongo
const Teacher = mongoose.model("teachers", teacherSchema);
const Meeting = mongoose.model("meetings", meetingSchema);
const MidMarks = mongoose.model("midmarks", midMarksSchema);
const AssignmentMarks = mongoose.model(
  "assignmentmarks",
  assignmentMarksSchema
);
const QuizMarks = mongoose.model("quizmarks", quizMarksSchema);

//Middleware -Plugin
app.use(express.urlencoded({ extended: false }));

//REST API
app.get("/student-login/:id/:password", async (req, res) => {
  const Id = req.params.id;
  const Password = req.params.password;
  const details = await Student.findOne({
    registrationNumber: Id,
    password: Password,
  });
  if (details) {
    return res.status(200).json(details);
  }
  return res.json("invalid details");
});

app.get("/teacher-login/:id/:password", async (req, res) => {
  const Id = req.params.id;
  const Password = req.params.password;
  const details = await Teacher.findOne({
    registrationNumber: Id,
    password: Password,
  });
  if (details) {
    return res.status(200).json(details);
  }
  return res.json("invalid details");
});

app.get("/student-details/:id", async (req, res) => {
  const studentId = req.params.id;
  if (!studentId) {
    return res.status(200).json({ msg: "All fields are required" });
  }
  const viewDetail = await Student.findOne({ _id: studentId });
  //Student.findById(studentId);
  return res.json(viewDetail);
});

app.get("/teacher-details/:id", async (req, res) => {
  const teacherId = req.params.id;
  const viewDetail = await Teacher.findOne({ _id: teacherId });
  return res.json(viewDetail);
});

app.get("/teacher-meetings/:id", async (req, res) => {
  const teacherId = req.params.id;
  const meetingDetails = await Meeting.find({ teacher: teacherId }).populate(
    "student"
  ); //field name
  return res.json(meetingDetails);
});

app.get("/student-meetings/:id", async (req, res) => {
  const studentId = req.params.id;
  const meetingDetails = await Meeting.find({ student: studentId }).populate(
    "teacher"
  ); //field name
  return res.json(meetingDetails);
});

app.get("/student-mid-marks/:studentId", async (req, res) => {
  const studentId = req.params.studentId;
  const marks = await MidMarks.find({ student: studentId });
  return res.status(200).json(marks);
});

app.get("/student-assignment-marks/:studentId", async (req, res) => {
  const studentId = req.params.studentId;
  const marks = await AssignmentMarks.aggregate([
    {
      $match: {
        student: new mongoose.Types.ObjectId(studentId),
      },
    },
    {
      $sort: {
        number: 1,
        courseCode: 1,
      },
    },
  ]);
  return res.status(200).json(marks);
});

app.get("/student-quiz-marks/:studentId", async (req, res) => {
  const studentId = req.params.studentId;
  const marks = await QuizMarks.aggregate([
    {
      $match: {
        student: new mongoose.Types.ObjectId(studentId),
      },
    },
    {
      $sort: {
        number: 1,
        courseCode: 1,
      },
    },
  ]);
  return res.status(200).json(marks);
});

app.get(
  "/mid-marks-by-section/:section/:teacherId/:courseCode",
  async (req, res) => {
    const sec = req.params.section;
    const teacherId = new mongoose.Types.ObjectId(req.params.teacherId);
    const code = req.params.courseCode;
    const students = await Student.aggregate([
      {
        $match: {
          section: sec,
        },
      },
      {
        $lookup: {
          from: "midmarks",
          let: { studentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$student", "$$studentId"] },
                    { $eq: ["$teacher", teacherId] },
                    { $eq: ["$courseCode", code] },
                  ],
                },
              },
            },
          ],
          as: "marks",
        },
      },
      {
        $unwind: {
          path: "$marks",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          marks: "$marks.marks",
        },
      },
    ]);

    return res.status(200).json(students);
  }
);

app.get(
  "/assignment-marks-by-section/:section/:teacherId/:courseCode/:assignmentNo",
  async (req, res) => {
    const sec = req.params.section;
    const teacherId = new mongoose.Types.ObjectId(req.params.teacherId);
    const code = req.params.courseCode;
    const num = Number(req.params.assignmentNo);
    const students = await Student.aggregate([
      {
        $match: {
          section: sec,
        },
      },
      {
        $lookup: {
          from: "assignmentmarks",
          let: { studentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$student", "$$studentId"] },
                    { $eq: ["$teacher", teacherId] },
                    { $eq: ["$courseCode", code] },
                    { $eq: ["$number", num] },
                  ],
                },
              },
            },
          ],
          as: "marks",
        },
      },
      {
        $unwind: {
          path: "$marks",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          marks: "$marks.marks",
        },
      },
    ]);
    return res.status(200).json(students);
  }
);

app.get(
  "/quiz-marks-by-section/:section/:teacherId/:courseCode/:quizNo",
  async (req, res) => {
    const sec = req.params.section;
    const teacherId = new mongoose.Types.ObjectId(req.params.teacherId);
    const code = req.params.courseCode;
    const num = Number(req.params.quizNo);
    const students = await Student.aggregate([
      {
        $match: {
          section: sec,
        },
      },
      {
        $lookup: {
          from: "quizmarks",
          let: { studentId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$student", "$$studentId"] },
                    { $eq: ["$teacher", teacherId] },
                    { $eq: ["$courseCode", code] },
                    { $eq: ["$number", num] },
                  ],
                },
              },
            },
          ],
          as: "marks",
        },
      },
      {
        $unwind: {
          path: "$marks",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          marks: "$marks.marks",
        },
      },
    ]);
    return res.status(200).json(students);
  }
);

app.post("/add-student", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.name ||
    !body.registrationNumber ||
    !body.email ||
    !body.phoneNumber ||
    !body.degree ||
    !body.section ||
    !body.password
  ) {
    return res.status(200).json({ msg: "All fields are required" });
  }

  const existingStudent = await Student.findOne({
    $or: [{ email: body.email }, { phoneNumber: body.phoneNumber }],
  });
  if (existingStudent) {
    return res.json({ msg: "Already exists" });
  }

  const result = await Student.create({
    name: body.name,
    registrationNumber: body.registrationNumber,
    email: body.email,
    phoneNumber: body.phoneNumber,
    degree: body.degree,
    section: body.section,
    password: body.password,
  });
  return res.status(201).json(result);
});

app.post("/add-teacher", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.name ||
    !body.registrationNumber ||
    !body.email ||
    !body.phoneNumber ||
    !body.courseCode ||
    !body.password
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const existingTeacher = await Teacher.findOne({
    $or: [{ email: body.email }, { phoneNumber: body.phoneNumber }],
  });
  if (existingTeacher) {
    return res.json({ msg: "Already exists" });
  }

  const result = await Teacher.create({
    name: body.name,
    registrationNumber: body.registrationNumber,
    email: body.email,
    phoneNumber: body.phoneNumber,
    courseCode: body.courseCode,
    sections: body.sections,
    password: body.password,
  });
  return res.status(201).json(result);
});

app.post("/add-meeting", async (req, res) => {
  const body = req.body;
  if (!body || !body.teacher || !body.student || !body.date || !body.time) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  const result = await Meeting.create({
    teacher: body.teacher,
    student: body.student,
    date: body.date,
    time: body.time,
  });
  return res.status(201).json(result);
});

app.post("/add-midmarks", async (req, res) => {
  const body = req.body;
  if (!body || !body.teacher || !body.studentMarks.length || !body.courseCode) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  let teacherId = new mongoose.Types.ObjectId(body.teacher);
  for (let stu of body.studentMarks) {
    let studentId = new mongoose.Types.ObjectId(stu.studentId);
    await MidMarks.updateOne(
      { teacher: teacherId, student: studentId, courseCode: body.courseCode },
      {
        $set: {
          teacher: teacherId,
          student: studentId,
          marks: stu.marks,
          courseCode: body.courseCode,
        },
      },
      { upsert: true }
    );
  }
  return res.status(201).json({});
});

app.post("/add-assignmentmarks", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.teacher ||
    !body.studentMarks.length ||
    !body.courseCode ||
    !body.assignmentNumber
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  let teacherId = new mongoose.Types.ObjectId(body.teacher);
  for (let stu of body.studentMarks) {
    let studentId = new mongoose.Types.ObjectId(stu.studentId);
    await AssignmentMarks.updateOne(
      {
        teacher: teacherId,
        student: studentId,
        courseCode: body.courseCode,
        number: parseFloat(body.assignmentNumber),
      },
      {
        $set: {
          teacher: teacherId,
          student: studentId,
          marks: stu.marks,
          courseCode: body.courseCode,
          number: parseFloat(body.assignmentNumber),
        },
      },
      { upsert: true }
    );
  }
  return res.status(201).json({});
});

app.post("/add-quizmarks", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.teacher ||
    !body.studentMarks.length ||
    !body.courseCode ||
    !body.quizNumber
  ) {
    return res.status(400).json({ msg: "All fields are required" });
  }
  let teacherId = new mongoose.Types.ObjectId(body.teacher);
  for (let stu of body.studentMarks) {
    let studentId = new mongoose.Types.ObjectId(stu.studentId);
    await QuizMarks.updateOne(
      {
        teacher: teacherId,
        student: studentId,
        courseCode: body.courseCode,
        number: parseFloat(body.quizNumber),
      },
      {
        $set: {
          teacher: teacherId,
          student: studentId,
          marks: stu.marks,
          courseCode: body.courseCode,
          number: parseFloat(body.quizNumber),
        },
      },
      { upsert: true }
    );
  }
  return res.status(201).json({});
});

app.listen(PORT, () => console.log(`Server Startrd at Port ${PORT}`));

app.route("/section-students/:section").get(async (req, res) => {
  const sec = req.params.section;
  const students = await Student.find({ section: sec });
  return res.status(200).json(students);
});

app.get("/risk-students/:teacherId/:courseCode/:section", async (req, res) => {
    const teacherId = req.params.teacherId;
    const courseCode = req.params.courseCode;
    const section = req.params.section;
    if (!teacherId || !courseCode || !section) {
      return res.status(200).json({ msg: "All fields are required" });
    }
    const studentIds = await Student.distinct('_id',{section:section})
    if(!studentIds.length){
        return res.status(200).json({});
    }
    const highestMarkRecord = await MidMarks.findOne({student:{$in:studentIds},courseCode,teacher:teacherId}).sort({marks:-1}).limit(1);
    if(!highestMarkRecord){
        return res.status(200).json({});
    }
    const marks = highestMarkRecord.marks/2;
    const details = await MidMarks.find({student:{$in:studentIds},courseCode,teacher:teacherId,marks:{$lt:marks}}).populate('student')
    return res.status(200).json(details);
  });
