const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

const authRoutes = require("./routes/auth.route");
const postRoutes = require("./routes/post.route");

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);

module.exports = app;
