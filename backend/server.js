//create http server
//import express module
const exp = require("express");
const app = exp();
const cors=require('cors')

app.use(cors({
  origin:'http://localhost:5173'  //origin: ['http://localhost:5173','http://localhost:6000'] or origin:'*'
}))

require('dotenv').config() //process.env.SECRET_ENV
//import MongoClient
const { MongoClient } = require("mongodb");
//Create MongoClient object
let mClient = new MongoClient(process.env.DB_URL);

//connect to mongodb server
mClient
  .connect()
  .then((connectionObj) => {   
    //connect to a database(fsd)
    const lmsdb=connectionObj.db('Library_Management_System');
    //connect to a collection
    const usersCollection=lmsdb.collection('users')
    const librariansCollection=lmsdb.collection('librarians')
    const booksCollection=lmsdb.collection('books')
    //share collection obj tp APIS
    app.set('usersCollection',usersCollection);
    app.set('librariansCollection',librariansCollection);
    app.set('booksCollection',booksCollection);

    console.log("Db connection success");

    //assign port numbr to http server of express app
    app.listen(process.env.PORT, () => console.log("http server started on port 5000"));
  })
  .catch((err) => console.log("Error in DB connection", err));
  

//import userApp express object
const usersApp = require("./APIs/usersAPI");
const librariansApp = require("./APIs/librariansAPI");
const booksApp = require("./APIs/booksAPI");

//if path starts with /user-api, forward req to userApp
app.use("/users-api", usersApp);
//if path starts with /user-api, forward req to userApp
app.use("/librarians-api", librariansApp);

app.use("/books-api",booksApp)

//handling invalid path
app.use('*',(req,res,next)=>{
  console.log(req.path)
  res.send({message:`Invalid path`})
})

//error handling middleware
app.use((err,req,res,next)=>{
  res.send({message:"error occurred",errorMessage:err.message})
})