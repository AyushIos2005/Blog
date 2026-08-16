const express = require("express");
const authRouter = require("./routers/auth.router");
const cookieParser = require("cookie-parser");
const postRouter = require("./routers/post.route");
const profileRouter = require("./routers/profile.route");
const app = express();
//middleware 

// Allow the frontend (running on a different origin/port, e.g. Vite's
// localhost:5173) to call this API and send/receive the httpOnly "token"
// cookie. Set FRONTEND_URL in .env if you deploy the frontend elsewhere.
const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", FRONTEND_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json())
app.use(cookieParser());
//api

//api for login/register/logout
app.use("/api/auth",authRouter);
app.use("/api/post",postRouter);
app.use("/api/profile",profileRouter);
//api for post creating

module.exports = app;