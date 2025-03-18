const exp = require("express");
const booksApp = exp.Router();
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const tokenVerify=require('../middlewares/tokenVerify')
const expressAsyncHandler=require('express-async-handler')
require('dotenv').config()


booksApp.use(exp.json())

const { ObjectId } = require('mongodb');


//get all books
booksApp.get('/books', expressAsyncHandler(async (req, res) => {
  const booksCollection = req.app.get("booksCollection");
  // const { bookName, edition, author } = req.query;

  // // Construct a dynamic query based on the provided fields
  // const query = {};
  // if (bookName) query.bookName = bookName;
  // if (edition) query.edition = edition;
  // if (author) query.author = author;

  // // Use find() to get all books matching the query
  //let books = await booksCollection.find(query).toArray();
  let books = await booksCollection.find().toArray();
  if (books.length === 0) {
    return res.status(404).send({ message: "No books found" });
  }
  res.send({ message: "Books found", payload: books });
}));




//patching the books details to decrease count when ever a book is borrowed
// booksApp.patch('/books/:bookId', expressAsyncHandler(async (req, res) => {
//   const booksCollection = req.app.get("booksCollection");
//   const bookId = req.params.bookId;
//   const { noOfBooks } = req.body;

//   let updatedBook = await booksCollection.findOneAndUpdate(
//     { _id: new ObjectId(bookId) },
//     { $set: { noOfBooks } },
//     { returnDocument: "after" }
//   );

//   if (!updatedBook) {
//     return res.status(404).send({ message: "Book not found" });
//   }
//   res.send({ message: "Book count updated", payload: updatedBook });
// }));



//patch to decrease
booksApp.patch('/books/:bookId/borrow', expressAsyncHandler(async (req, res) => {
  const booksCollection = req.app.get("booksCollection");
  const bookId = req.params.bookId;

  try {
      let book = await booksCollection.findOne({ _id: new ObjectId(bookId) });

      if (!book) {
          return res.status(404).send({ message: "Book not found" });
      }

      if (book.noOfBooks <= 0) {
          return res.status(400).send({ message: "Book is not available" });
      }

      let updatedBook = await booksCollection.findOneAndUpdate(
          { _id: new ObjectId(bookId) },
          { $inc: { noOfBooks: -1 } }, // Decrease count
          { returnDocument: "after" }
      );

      res.send({ message: "Book borrowed successfully", payload: updatedBook });
  } catch (error) {
      res.status(500).send({ message: "Error updating book", error });
  }
}));


// booksApp.patch('/users/:userId/borrow', expressAsyncHandler(async (req, res) => {
//   const booksCollection = req.app.get("booksCollection");
//   const usersCollection = req.app.get("usersCollection");
//   const { userId } = req.params;
//   const { bookData } = req.body; // Pass bookData (bookName, author, edition, etc.)

//   try {
//     // Fetch book details
//     let book = await booksCollection.findOne({ _id: new ObjectId(bookData.bookId) });

//     if (!book || book.noOfBooks <= 0) {
//       return res.status(400).send({ message: "Book is not available" });
//     }

//     // Update borrowedBooks in user's collection
//     await usersCollection.updateOne(
//       { _id: new ObjectId(userId) },
//       { $push: { borrowedBooks: bookData } }
//     );

//     // Decrease book count
//     await booksCollection.updateOne(
//       { _id: new ObjectId(bookData.bookId) },
//       { $inc: { noOfBooks: -1 } }
//     );

//     res.send({ message: "Book borrowed successfully" });
//   } catch (error) {
//     res.status(500).send({ message: "Error borrowing book", error });
//   }
// }));



//patch to increase 
booksApp.patch('/books/:bookId/return', expressAsyncHandler(async (req, res) => {
  const booksCollection = req.app.get("booksCollection");
  const bookId = req.params.bookId;

  try {
      let updatedBook = await booksCollection.findOneAndUpdate(
          { _id: new ObjectId(bookId) },
          { $inc: { noOfBooks: 1 } }, // Increase count
          { returnDocument: "after" }
      );

      if (!updatedBook) {
          return res.status(404).send({ message: "Book not found" });
      }

      res.send({ message: "Book returned successfully", payload: updatedBook });
  } catch (error) {
      res.status(500).send({ message: "Error updating book", error });
  }
}));



//get book details by bookName or bookName+Edition
booksApp.get('/books/:bookName/:author?/:edition?', expressAsyncHandler(async (req, res) => {
  const booksCollection = req.app.get("booksCollection");
  const { bookName, edition ,author} = req.params;

  let query = { bookName: { $regex: new RegExp(`^${bookName}$`, 'i') } }; // Case-insensitive match

  if (edition) {
    query.edition = { $regex: new RegExp(`^${edition}$`, 'i') }; // Case-insensitive edition match
  }

  if(author){
    query.author = { $regex: new RegExp(`^${author}$`,'i')}
  }

  const books = await booksCollection.find(query).toArray();

  if (books.length === 0) {
    return res.status(404).json({ message: "Book not available." });
  }

  res.json(books);
}));



//add book if not there else increase book count
booksApp.post('/add', expressAsyncHandler(async (req, res) => {
  const booksCollection = req.app.get("booksCollection");
  const { bookName, author, edition, branch, noOfBooks } = req.body;

  if (!bookName || !author || !edition || !branch || !noOfBooks) {
    return res.status(400).send({ message: "All fields are required" });
  }

  let existingBook = await booksCollection.findOne({ bookName, author, edition });

  if (existingBook) {
    let updatedCount = existingBook.noOfBooks + noOfBooks;

    await booksCollection.updateOne(
      { bookName, author, edition },
      { $set: { noOfBooks: updatedCount } }
    );

    res.status(200).send({ message: "Book count updated successfully" });
  } else {
    let newBook = { bookName, author, edition, branch, noOfBooks };
    await booksCollection.insertOne(newBook);

    res.status(201).send({ message: "Book added successfully" });
  }
}));


booksApp.patch(
  "/books/borrow",
  expressAsyncHandler(async (req, res) => {
    const booksCollection = req.app.get("booksCollection");
    const { bookName, edition } = req.body;

    try {
      // Find the book by name and edition
      let book = await booksCollection.findOne({ bookName, edition });

      if (!book) {
        return res.status(404).send({ message: "Book not found" });
      }

      // Check if the book is available for borrowing
      if (book.noOfBooks <= 0) {
        return res.status(400).send({ message: "Book is not available" });
      }

      // Decrease book count by 1
      let updatedBook = await booksCollection.findOneAndUpdate(
        { bookName, edition },
        { $inc: { noOfBooks: -1 } },
        { returnDocument: "after" }
      );

      res.send({
        message: "Book borrowed successfully",
        payload: updatedBook,
      });
    } catch (error) {
      res.status(500).send({ message: "Error updating book", error });
    }
  })
);



// Export the router
module.exports = booksApp;
