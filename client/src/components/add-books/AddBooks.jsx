import React from 'react';
import './AddBooks.css';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function AddBooks() {
  let { register, handleSubmit, formState: { errors }, reset } = useForm();
  const navigate = useNavigate();

  // Handle book addition or update
  async function onSubmit(data) {
    console.log("Form Data:", data);

    // Convert noOfBooks to a number
    data.noOfBooks = Number(data.noOfBooks);

    // Send request to add or update the book
    let res = await fetch("http://localhost:5000/books-api/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    let result = await res.json();

    if (res.ok) {
     // alert(result.message); // Show success message
      reset(); // Reset the form
      navigate("/add-books"); // Navigate back to the add books page
    } else {
      alert(result.message || "Error adding/updating book.");
    }
  }

  

  return (
    <div>
      <div className="button-container">
        <button type="button" className="btn btn-primary" onClick={() => navigate('/all-users')}> View Users </button>
      </div>

      <div className="button-container">
        <button type="button" className="btn btn-primary" onClick={() => navigate('/add-librarians')}> Add Librarians </button>
      </div>
      
      <form className="addpage" onSubmit={handleSubmit(onSubmit)}>
        <h3 className='heading'>Add Books</h3>

        <div className="mb-3">
          <input type="text" className='form-control' {...register("bookName", { required: true })} placeholder='Book Name' />
          {errors.bookName && <p className='text-danger lead'>*Book Name is required</p>}
        </div>

        <div className="mb-3">
          <input type="text" className='form-control' {...register("author", { required: true })} placeholder='Author' />
          {errors.author && <p className='text-danger lead'>*Author is required</p>}
        </div>

        <div className="mb-3">
          <input type="text" className='form-control' {...register("edition", { required: true })} placeholder='Edition' />
          {errors.edition && <p className='text-danger lead'>*Edition is required</p>}
        </div>

        <div className="mb-2">  
          <select id='branch' className='form-control' {...register("branch", { required: true })}>
            <option value="">Select a Branch</option>
            <option value="cse">CSE</option>
            <option value="it">IT</option>
            <option value="ece">ECE</option>
            <option value="eee">EEE</option>
            <option value="mech">MECH</option>
            <option value="civil">CIVIL</option>
            <option value="aiml">AIML</option>
            <option value="ds">DS</option>
            <option value="gat">GATE</option>
            <option value="magazines">MAGAZINES</option>
          </select>
          {errors.branch && <p className='text-danger lead'>*This field is required</p>}
        </div>

        <div className="mb-3">
          <input type="number" className='form-control' {...register("noOfBooks", { required: true })} placeholder='No. of Books' />
          {errors.noOfBooks && <p className='text-danger lead'>*No. of Books is required</p>}
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-success">Add Book</button>
        </div>
      </form>
    </div>
  );
}

export default AddBooks;