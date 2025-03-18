import { librarianLoginContext } from './librarianLoginContext';
import { useState,useEffect } from "react";


function LibrarianLoginStore({ children }) {
  // login user state
  const [currentUser, setCurrentLibrarian] = useState(null);
  const [librarianLoginStatus, setLibrarianLoginStatus] = useState(false);
  const [errormsg, setErrormsg] = useState("");
  const [users,setUsers] =useState([])  //store all users



   //fetch all users when librarian login for accessing users account to update their data when ever they borrowed books from libraray
   async function fetchUsers(){
    try{
    let res =await fetch("http://localhost:3000/users");
    let usersList=await res.json();
    setUsers(usersList);
   }
   catch (error){
  console.log("Error in fetching users:",error);
   }
  }


  // Librarian login
  async function loginLibrarian(userCred) {
    try {
      let resLibrarian = await fetch("http://localhost:5000/librarians-api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userCred),
      });

      let librarianData = await resLibrarian.json(); 
      if(librarianData.message ==='Login successful'){
        setCurrentLibrarian(librarianData.librarian);
        setLibrarianLoginStatus(true);
        return;
      }

      setErrormsg(librarianData.message);
      // if (librariansList.length === 0) {
      //   setCurrentLibrarian(null);
      //   setLibrarianLoginStatus(false);
      //   setErr("Invalid Username or Password");
      // } else {
      //   setCurrentLibrarian(librariansList[0]);
      //   setLibrarianLoginStatus(true);
      //   setErr("");
      //   fetchUsers(); //fetch all users when he logged in successfully
      // }
    } catch (error) {
      setErrormsg(error.message);
    }
  }

  // //  librarian updates the users data when he borrowed the book from the library
  // async function updateUserBooks(userId, bookDetails) {
  //   let user = users.find(user => user.id === userId);
  //   if (!user) return;

  //   let updatedBooks = [...(user.borrowedBooks || []), bookDetails];

  //   try {
  //     let res = await fetch(`http://localhost:3000/users/${userId}`, {
  //       method: "PATCH",
  //       headers: { "Content-type": "application/json" },
  //       body: JSON.stringify({ borrowedBooks: updatedBooks }),
  //     });

  //     if (res.ok) {
  //       setUsers(users.map(u => u.id === userId ? { ...u, borrowedBooks: updatedBooks } : u));
  //     }
  //   } catch (error) {
  //     console.error("Error updating user books:", error);
  //   }
  // }

  // user logout
  function logoutLibrarian() {
    setCurrentLibrarian(null);
    setLibrarianLoginStatus(false);
    setErrormsg("");
    setUsers([]);  //clears users on logging out
    sessionStorage.removeItem('token');
  }

  return (
    <librarianLoginContext.Provider
      value={{ loginLibrarian, logoutLibrarian, librarianLoginStatus, errormsg, currentLibrarian:currentUser, setCurrentLibrarian,users }}  //function to update borrowed books books
    >
      {children}
    </librarianLoginContext.Provider>
  );
}

export default LibrarianLoginStore;
