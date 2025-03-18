const exp=require('express');
const usersApp=exp.Router();
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const tokenVerify=require('../middlewares/tokenVerify')
const expressAsyncHandler=require('express-async-handler')
require('dotenv').config()

//add body parser middleware
usersApp.use(exp.json())

const { ObjectId } = require('mongodb');

//get users
usersApp.get('/users', expressAsyncHandler(async (req, res) => {
  console.log("Fetching users...");  // Debugging log
  const usersCollection = req.app.get('usersCollection');
  let usersList = await usersCollection.find().toArray();
  console.log("Users found:", usersList);
  
  res.send({ message: "users", payload: usersList });
}));


//get user by rollNo
usersApp.get('/users/:rollNo', expressAsyncHandler(async (req, res) => {
  const usersCollection = req.app.get("usersCollection");
  const rollNoOfUrl = req.params.rollNo;

  let user = await usersCollection.findOne({ rollNo: rollNoOfUrl });
  if (!user) {
      return res.status(404).send({ message: "User not found" });
  }
  res.send({ message: "User found", payload: user });
}));



//get users by userId
// usersApp.get('/users/:userId', expressAsyncHandler(async (req, res) => {
//   const usersCollection = req.app.get("usersCollection");
//   const userId = req.params.userId;

//   let user = await usersCollection.findOne({ _id: new ObjectId(userId) });
//   if (!user) {
//     return res.status(404).send({ message: "User not found" });
//   }
//   res.send(user);
// }));




//user register
usersApp.post('/register', expressAsyncHandler(async (req, res) => {
  const usersCollection = req.app.get("usersCollection");
  let newUser = req.body;
  if (!newUser.username || !newUser.email || !newUser.rollNo || !newUser.branch || !newUser.password || !newUser.mobile) {
      return res.status(400).send({ message: "All fields are required" });
  }
  let existingUser = await usersCollection.findOne({
      $or: [{ rollNo: newUser.rollNo }, { email: newUser.email }]
  });

  if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
  }
  newUser.password = await bcryptjs.hash(newUser.password, 7);
  newUser.borrowedBooks = [];

  await usersCollection.insertOne(newUser);
  res.status(201).send({ message: "User registered successfully" });
}));



//user login
usersApp.post('/login', expressAsyncHandler(async (req, res) => {
  const usersCollection = req.app.get("usersCollection");
  const { email, password } = req.body;
  if (!email || !password) {
      return res.status(400).send({ message: "All fields are required" });
  }
  let user = await usersCollection.findOne({ email });
  console.log(user);
  if (!user) {
      return res.status(400).send({ message: "Invalid login credentials" });
  }
  // Compare password
  let isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) {
      return res.status(400).send({ message: "Invalid login credentials" });
  }
  let token = jwt.sign({ userId: user._id, role: "user" }, process.env.SECRET_KEY, { expiresIn: "1d" });
  res.status(200).send({
      message: "Login successful",
      token,
      user
  });
}));


// //request for borrowing Book 
// usersApp.put('/users/:rollNo/borrow', expressAsyncHandler(async (req, res) => {
//   const usersCollection = req.app.get("usersCollection");
//   const { rollNo } = req.params;
//   const bookDetails = req.body;
//   let user = await usersCollection.findOne({ rollNo });

//   if (!user) {
//       return res.status(404).send({ message: "User not found" });
//   }
//   await usersCollection.updateOne(
//       { rollNo },
//       { $push: { borrowedBooks: bookDetails } }
//   );

//   res.send({ message: "Book borrowed successfully", book: bookDetails });
// }));



//patch the user details to add borrowed books 
usersApp.patch("/users/borrowbook/:userId",expressAsyncHandler(async (req, res) => {
    const usersCollection = req.app.get("usersCollection");
    const booksCollection = req.app.get("booksCollection");
    const userId = req.params.userId;
    const { borrowedBooks } = req.body;

    // Find the user by ID
    let user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if the user has already borrowed any of the books
    const existingBooks = user.borrowedBooks || [];
    for (let book of borrowedBooks) {
      let alreadyBorrowed = existingBooks.some(
        (b) =>
          b.bookName.toLowerCase() === book.bookName.toLowerCase() &&
          b.edition.toLowerCase() === book.edition.toLowerCase() &&
          b.author.toLowerCase() === book.author.toLowerCase()
      );

      if (alreadyBorrowed) {
        return res.status(400).send({
          message: `Book "${book.bookName}" (Edition: ${book.edition}, Author: ${book.author}) is already borrowed.`,
        });
      }

      // Check if the book exists in the books collection (case-insensitive search)
      let availableBook = await booksCollection.findOne({
        bookName: { $regex: new RegExp(`^${book.bookName}$`, "i") },
      });

      if (!availableBook) {
        return res.status(400).send({
          message: `Book "${book.bookName}" is not available in the library.`,
        });
      }

      // Check for edition mismatch
      let editionMatch = await booksCollection.findOne({
        bookName: { $regex: new RegExp(`^${book.bookName}$`, "i") },
        edition: { $regex: new RegExp(`^${book.edition}$`, "i") },
      });

      if (!editionMatch) {
        return res.status(400).send({
          message: `Edition "${book.edition}" of "${book.bookName}" is not available.`,
        });
      }

      // Check for author mismatch
      let authorMatch = await booksCollection.findOne({
        bookName: { $regex: new RegExp(`^${book.bookName}$`, "i") },
        edition: { $regex: new RegExp(`^${book.edition}$`, "i") },
        author: { $regex: new RegExp(`^${book.author}$`, "i") },
      });

      if (!authorMatch) {
        return res.status(400).send({
          message: `Author "${book.author}" does not match for "${book.bookName}" (Edition: ${book.edition}).`,
        });
      }

      // Check if the book is available to borrow
      if (authorMatch.noOfBooks <= 0) {
        return res.status(400).send({
          message: `Book "${book.bookName}" (Edition: ${book.edition}, Author: ${book.author}) is not available for borrowing.`,
        });
      }
    }

    // Add the new books to user's borrowedBooks list
    let updatedBorrowedBooks = [...existingBooks, ...borrowedBooks];

    // Update user with new borrowed books
    let updatedUser = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { borrowedBooks: updatedBorrowedBooks } },
      { returnDocument: "after" }
    );

    // Decrease the count of the borrowed books in the books collection
    for (let book of borrowedBooks) {
      await booksCollection.updateOne(
        {
          bookName: { $regex: new RegExp(`^${book.bookName}$`, "i") },
          edition: { $regex: new RegExp(`^${book.edition}$`, "i") },
          author: { $regex: new RegExp(`^${book.author}$`, "i") },
        },
        { $inc: { noOfBooks: -1 } }
      );
    }

    res.send({
      message: "Books borrowed successfully",
      payload: updatedUser,
    });
  })
);


  

// patch req to remove books from userdata 
usersApp.patch("/users/removeBook/:userId",expressAsyncHandler(async (req, res) => {
    const usersCollection = req.app.get("usersCollection");
    const booksCollection = req.app.get("booksCollection");
    const userId = req.params.userId;
    const { bookName, author, edition } = req.body; // Book details being returned

    // Fetch the user by their ID
    let user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Check if the book exists in the borrowedBooks array (case-insensitive check)
    let bookIndex = user.borrowedBooks.findIndex(
      (b) =>
        b.bookName.toLowerCase() === bookName.toLowerCase() &&
        b.author.toLowerCase() === author.toLowerCase() &&
        b.edition.toLowerCase() === edition.toLowerCase()
    );

    // If the book is not found in the user's borrowedBooks
    if (bookIndex === -1) {
      return res.status(400).send({
        message: `Book "${bookName}" (Edition: ${edition}, Author: ${author}) is not borrowed by the user.`,
      });
    }

    // Get the book to be returned
    let bookToReturn = user.borrowedBooks[bookIndex];

    // Remove the book from the borrowedBooks array
    let updatedBorrowedBooks = user.borrowedBooks.filter(
      (_, index) => index !== bookIndex
    );

    // Update user's borrowedBooks field in the database
    let updatedUser = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { borrowedBooks: updatedBorrowedBooks } },
      { returnDocument: "after" }
    );

    // Increase the book count in the books collection
    let updatedBook = await booksCollection.findOneAndUpdate(
      {
        bookName: { $regex: new RegExp(`^${bookName}$`, "i") },
        edition: { $regex: new RegExp(`^${edition}$`, "i") },
        author: { $regex: new RegExp(`^${author}$`, "i") },
      },
      { $inc: { noOfBooks: 1 } },
      { returnDocument: "after" }
    );

    if (!updatedBook) {
      return res.status(400).send({
        message: `Error updating book count for "${bookName}" (Edition: ${edition}, Author: ${author})`,
      });
    }

    res.send({
      message: `Book "${bookName}" (Edition: ${edition}, Author: ${author}) successfully returned and count updated.`,
      payload: updatedUser,
    });
  })
);






module.exports = usersApp;
