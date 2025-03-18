import React, { useEffect, useState } from 'react';
import "./Login.css";
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { userLoginContext } from '../../contexts/userLoginContext';
import { librarianLoginContext } from '../../contexts/librarianLoginContext';
import { useContext } from 'react';

function Login() {
  let { register, handleSubmit, formState: { errors } } = useForm();
  let { loginUser,setCurrentUser, userLoginStatus,setUserLoginStatus,err} = useContext(userLoginContext);
  let {  loginLibrarian,librarianLoginStatus,errormsg } = useContext(librarianLoginContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages

  async function onUserLogin(userCred) {
    setErrorMessage(""); // Reset error message

    loginUser(userCred);

    // try {
    //   // First, try logging in as a user
    //   let resUser = await fetch("http://localhost:5000/users-api/login", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(userCred),
    //   });
      
    //   let userData = await resUser.json();
    //   console.log("msg",userData.message)
    //   console.log("userData",userData)
    //   if (userData.message === 'Login successful') {
    //     setCurrentUser(userData.user)
    //     setUserLoginStatus(true)
        
    //     navigate("/");
    //     return; // Stop execution since login is successful
    //   }
  
      // If not a user, try logging in as a librarian
      console.log("userCred",userCred)
      if(!userLoginStatus){
        
       loginLibrarian(userCred);
        
      }
  }
  

  useEffect(() => {
    if (userLoginStatus) {
      navigate('/');
    } else if (librarianLoginStatus) {
      navigate('/add-books');
    }
  }, [userLoginStatus, librarianLoginStatus, navigate]);

  return (
    <div className='loginpage'>
      <div className='container mt-5 login'>
        <div className='hostelimg'>
          <img src="https://static.vecteezy.com/system/resources/thumbnails/001/263/381/small_2x/library-interior-with-books.jpg" alt="" />
        </div>
        <div className="logincard">
          <p className='quote1 text-center  text-dark'>Login to find your Books</p>
          {errorMessage && <p className="text-danger text-center">{errorMessage}</p>}
          <form className="loginform" onSubmit={handleSubmit(onUserLogin)}>
            <div className="mb-3">
              <input type="email" className='form-control' {...register("email", { required: true })} placeholder='Email' />
              {errors.email && <p className='text-danger lead'>*Email is required</p>}
            </div>
            <div className="mb-3">
              <input type="password" className='form-control' {...register("password", { required: true })} placeholder='Password' />
              {errors.password && <p className='text-danger lead'>*Password is required</p>}
            </div>
            <div className='text-center'>
              <button className="btn2 btn btn-success">Sign in</button>
              {err && errormsg && <p className="text-danger text-center">{errormsg}</p>}
            </div>
            <div className="forget">
              <p className='text-center p-3 fp'>Don't have an Account?</p>
              <Link to="/register" className="text-center nav-link text-primary">Register</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;

