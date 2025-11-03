const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();


app.use(
  cors({
    origin: 'http://localhost:3000', // Specify exact origin, not wildcard
    credentials: true, // Allow credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

const bookRouter = require("./routes/bookRoutes");
const userRouter = require("./routes/userRoutes");
const orderRouter = require("./routes/orderRoutes");
const reviewRouter = require("./routes/reviewRoutes");

const bookFsRouter = require("./routes/bookRoutes_fs");
const userFsRouter = require("./routes/userRoutes_fs");

app.use("/api/", bookRouter);
app.use("/api/", userRouter);
app.use("/api/", orderRouter);
app.use("/api/", reviewRouter);

app.use("/api/booksfs", bookFsRouter);
app.use("/api/usersfs", userFsRouter);

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

const port = process.env.PORT || 8080;

mongoose
  .connect("mongodb://localhost:27017/readify", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("backend started");
    app.listen(port, () =>
      console.log(`Server listening on http://localhost:${port}`)
    );
  })
  .catch((err) => {
    console.error("server not started", err.message);
  });

module.exports = app;
