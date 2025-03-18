import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { librarianLoginContext } from '../../contexts/librarianLoginContext';
import './AddLibrarians.css';

function AddLibrarians() {
  let { register, handleSubmit, formState: { errors } } = useForm();
  let { librarianLoginStatus } = useContext(librarianLoginContext);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  async function onLibrarianAdd(userCred) {
    try {
      let res = await fetch("http://localhost:5000/librarians-api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userCred)
      });

     let result = await res.json();

      if (res.ok) {
        navigate('/add-books'); // Redirect after adding librarian
      } else {
        setErrorMessage("Failed to add librarian.");
      }
    } catch (error) {
      console.error("Error adding librarian:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  useEffect(() => {
    if (librarianLoginStatus === false) { 
      navigate('/add-books'); // Only redirect if the user is NOT a librarian
    }
  }, [librarianLoginStatus, navigate]);

  return (
    <div className='add-librarians'>
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      <form onSubmit={handleSubmit(onLibrarianAdd)}>
         <h4 className='text-center h'>Add Librarians</h4>
         <div className="mb-2">
                <input type="text" id='username' className='form-control' {...register("username", { required: true, minLength: 4 ,validate: (value) => !/\s/.test(value)|| "Username should not contain spaces"})} placeholder='Username' />
                {errors.username?.type === "required" && <p className="text-danger lead">*Username is required</p>}
                {errors.username?.type === "minLength" && <p className="text-danger lead">*Min Length should be 4</p>}
                {errors.username?.message && <p className="text-danger lead">{errors.username.message}</p>}
         </div>
        <div className="mb-3">
          <input type="email" className='form-control' {...register("email", { required: true })} placeholder='Email' />
          {errors.email && <p className='text-danger lead'>*Email is required</p>}
        </div>
        <div className="mb-3">
          <input type="password" className='form-control' {...register("password", { required: true })} placeholder='Password' />
          {errors.password && <p className='text-danger lead'>*Password is required</p>}
        </div>
        <div className='text-center'>
          <button className="btn2 btn btn-success">Add</button>
        </div>
      </form>
    </div>
  );
}

export default AddLibrarians;