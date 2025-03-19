const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Initialize Express App
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/libraryDB");

// Define Book Schema and Model
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  isbn: String,
  available: Boolean
}, { versionKey: false }); // 🚀 Disables __v

const Book = mongoose.model("Book", bookSchema);

// Routes
// Add a new book
app.post("/books", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).send(book);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).send(books);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update book availability
app.put("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).send(book);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a book
app.delete("/books/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
