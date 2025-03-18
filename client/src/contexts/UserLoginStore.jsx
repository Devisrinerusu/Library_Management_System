import { userLoginContext } from "./userLoginContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserLoginStore({ children }) {
  // login user state
  // const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoginStatus, setUserLoginStatus] = useState(false);
  const [err, setErr] = useState("");

  // user login
  async function loginUser(userCred) {
    try {
      // First, try logging in as a user
      let resUser = await fetch("http://localhost:5000/users-api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userCred),
      });
      
      let userData = await resUser.json();
      console.log("msg",userData.message)
      console.log("userData",userData)
      if (userData.message === 'Login successful') {
        setCurrentUser(userData.user)
        setUserLoginStatus(true)
        return; // Stop execution since login is successful
      }
  
      // If not a user, try logging in as a librarian
      // let resLibrarian = await fetch("http://localhost:5000/librarians-api/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(userCred),
      // });
  
      // if (resLibrarian.status === 200) {
      //   let librarianData = await resLibrarian.json();
      //   loginLibrarian(librarianData.librarian);
      //   navigate("/add-books");
      //   return;
      // }
  
      // If neither request is successful, show an error
      setErr(userData.message);
    } catch (error) {
      console.error("Error during login:", error);
      setErr("Something went wrong. Please try again.");
    }
  }
  

console.log(sessionStorage.getItem("token"));
console.log(sessionStorage.getItem("user"));

  // user logout
 function logoutUser() {
  //reset state
  setCurrentUser(null);
  setUserLoginStatus(false);
  setErr("");
  sessionStorage.removeItem("token");
}

  

  return (
    <userLoginContext.Provider
      value={{ loginUser,logoutUser, userLoginStatus, err, currentUser, setCurrentUser, setUserLoginStatus }}
    >
      {children}
    </userLoginContext.Provider>
  );
}

export default UserLoginStore;