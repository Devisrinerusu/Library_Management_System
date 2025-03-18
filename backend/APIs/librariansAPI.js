const exp = require("express");
const librariansApp = exp.Router();
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')
const tokenVerify=require('../middlewares/tokenVerify')
const expressAsyncHandler=require('express-async-handler')
require('dotenv').config()


librariansApp.use(exp.json())

// Define routes
librariansApp.get("/", (req, res) => {
  res.send({ message: "User API working!" });
});


//register
librariansApp.post('/register', expressAsyncHandler(async (req, res) => {
  const librariansCollection = req.app.get("librariansCollection");
  let newLibrarian = req.body;
  if (!newLibrarian.username || !newLibrarian.email || !newLibrarian.password) {
      return res.status(400).json({ message: "All fields are required" });
  }
  let existingLibrarian = await librariansCollection.findOne({ email: newLibrarian.email });

  if (existingLibrarian) {
      return res.status(400).json({ message: "Librarian already exists" });
  }
  newLibrarian.password = await bcryptjs.hash(newLibrarian.password, 7);
  await librariansCollection.insertOne(newLibrarian);
  res.status(201).json({ message: "Librarian registered successfully" });
}));


//librarian login 
// librariansApp.post('/login', expressAsyncHandler(async (req, res) => {
//   const librariansCollection = req.app.get("librariansCollection");
//   const { email, password } = req.body;

//   if (!email || !password) {
//       return res.status(400).send({ message: "All fields are required" });
//   }

//   let librarian = await librariansCollection.findOne({ email });
//   if (!librarian) {
//       return res.status(400).send({ message: "Invalid email or password" });
//   }

//   let isPasswordValid = await bcryptjs.compare(password, librarian.password);
//   if (!isPasswordValid) {
//       return res.status(400).send({ message: "Invalid email or password" });
//   }

//   let token = jwt.sign({ librarianId: librarian._id, role: "librarian" }, process.env.SECRET_KEY, { expiresIn: "1d" });

//   res.status(200).send({
//       message: "Login successful",
//       token,
//       librarian: { username: librarian.username, email: librarian.email }
//   });

// }));


librariansApp.post('/login', expressAsyncHandler(async (req, res) => {
  const librariansCollection = req.app.get("librariansCollection");
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }

  let librarian = await librariansCollection.findOne({ email });

  if (!librarian) {
    return res.status(400).send({ message: "Invalid credentials" });  // Email not found case
  }

  let isPasswordValid = await bcryptjs.compare(password, librarian.password);
  if (!isPasswordValid) {
    return res.status(400).send({ message: "Invalid email or password" });
  }

  let token = jwt.sign({ librarianId: librarian._id, role: "librarian" }, process.env.SECRET_KEY, { expiresIn: "1d" });

  res.status(200).send({
    message: "Login successful",
    token,
    librarian
  });

}));







// Export the router
module.exports = librariansApp;
