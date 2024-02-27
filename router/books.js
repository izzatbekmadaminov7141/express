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
    res.sendFile(path.join(__dirname, "..", "views", "add-users.html"));
  } catch (error) {
    res.status(500).send("Error reading books data.");
  }
});
// post
router.post("/book", (req, res) => {
  const username = req.body.username;
  try {
    let books = JSON.parse(fs.readFileSync(booksJSON));

    const existingBook = books.find((book) => book.username === username);
    if (existingBook) {
      return res.status(400).send(`<h1>bunday kitob mavjud</h1>`);
    }
    const newBook = {
      ...req.body,
      id: uuid4(),
    };
    books.push(newBook);
    fs.writeFileSync(booksJSON, JSON.stringify(books));
    res.redirect("/");
  } catch (error) {
    res
      .status(500)
      .send("Kitoblar ma'lumotlarini yangilashda xatolik yuz berdi.");
  }
});
//put
router.put("/book/:id", (req, res) => {
  const bookId = req.params.id;
  const updatedBookData = req.body;
  try {
    const books = JSON.parse(fs.readFileSync(booksJSON));
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
      books[index] = { ...books[index], ...updatedBookData };
      fs.writeFileSync(booksJSON, JSON.stringify(books));
      res.status(200).send("Kitob ma'lumotlari muvaffaqiyatli yangilandi.");
    } else {
      res.status(404).send("Kitob topilmadi.");
    }
  } catch (err) {
    res.status(500).send("Kitob ma'lumotlarini yangilashda xatolik yuz berdi.");
  }
});
router.delete("/books/:id", (req, res) => {
  const bookId = req.params.id;
  try {
    let books = JSON.parse(fs.readFileSync(booksJSON));

    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
      books.splice(index, 1);
      fs.writeFileSync(booksJSON, JSON.stringify(books));
      res.status(200).send("Kitob muvaffaqiyatli o'chirildi.");
    } else {
      res.status(404).send("Kitob topilmadi.");
    }
  } catch (error) {
    res.status(500).send("Kitobni o'chirishda xatolik yuz berdi.");
  }
});

module.exports = router;
