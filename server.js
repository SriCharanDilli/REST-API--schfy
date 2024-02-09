require("dotenv").config();
const express = require("express");
const app = express();
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3500;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.log(err);
  }
};

connectDB();

// Middleware
app.use(logger);

const allowedOrigins = [
  "http://localhost:3500",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("public"));

// Require routes into variables
const rootRoutes = require("./routes/root");
const authRoutes = require("./routes/authRoutes");
const paperRoutes = require("./routes/paperRoutes");
const circularRoutes = require("./routes/circularRoutes");
const internalRoutes = require("./routes/internalRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const timeScheduleRoutes = require("./routes/timeScheduleRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");

// Use routes
app.use("/", rootRoutes);
app.use("/auth", authRoutes);
app.use("/paper", paperRoutes);
app.use("/circular", circularRoutes);
app.use("/internal", internalRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/time_schedule", timeScheduleRoutes);
app.use("/teacher", teacherRoutes);
app.use("/student", studentRoutes);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ message: "404 Not Found", details: "No paths found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");  
  app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}:${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});

mongoose.connection.on("uncaughtException", function (err) {
  console.log(err);
});
