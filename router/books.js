const { Router, urlencoded } = require("express");
const router = Router();
const fs = require("fs");
const path = require("path");
const { v4: uuid4 } = require("uuid");
router.use(urlencoded({ extended: true }));
const booksJSON = path.join(__dirname, "..", "books.json");
// get
router.get("/add-book", (req, res) => {
  try {
    let books = JSON.parse(fs.readFileSync(booksJSON));
    res.send(`
            <form action="/book" method="POST">
                <input type="text" name="username"/>
                <input type="text" name="author"/> <!-- Corrected typo here -->
                <button type="submit">Submit</button>
            </form>
        `);
  } catch (error) {
    res.status(500).send("Error reading books data.");
  }
});
// post
router.post("/book", (req, res) => {
  try {
    let books = JSON.parse(fs.readFileSync(booksJSON));
    const newBook = {
      ...req.body,
      id: uuid4(),
    };
    books.push(newBook);
    fs.writeFileSync(booksJSON, JSON.stringify(books));
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Error updating books data.");
  }
});

module.exports = router;
