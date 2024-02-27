const express = require("express");
const app = express();
const path = require("path");
const bookJson = require("./router/books.js");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", (req, res, next) => {
  next();
});
app.use(bookJson);
app.use("/", (req, res, next) => {
  res.sendFile(path.join(__dirname,  "views", "server.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) {
    console.log("Error listening on port", err);
  } else {
    console.log("Listen on port", PORT);
  }
});
