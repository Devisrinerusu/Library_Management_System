import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BorrowBook.css';
import { useForm } from 'react-hook-form';

function BorrowBook() {
  let { register, handleSubmit, formState: { errors } } = useForm();
  const { userName, rollNo, userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user data when component loads
  useEffect(() => {
    async function fetchUser() {
      try {
        let res = await fetch(`http://localhost:5000/users-api/users/${rollNo}`);
        if (res.ok) {
          let data = await res.json();
          setUser(data);
        } else {
          console.error("User not found.");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, [userId]);

  // Update user's borrowed books and decrease book count in backend
  async function updateUserBooks(bookData) {
    if (!user) return;

    // Send request to borrow book
    let res = await fetch(`http://localhost:5000/users-api/users/borrowbook/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ borrowedBooks: [bookData] }), // Send as array
    });

    let result = await res.json();

    if (!res.ok) {
      // Handle error messages returned from the backend
      setErrorMessage(result.message || "Error borrowing book. Please try again.");
      return;
    }

    // If book borrowed successfully, navigate back
    navigate("/all-users");
  }

  // Handle form submission
  function onSubmit(data) {
    setErrorMessage(""); // Reset error
    updateUserBooks(data);
  }


  return (
    <div className="borrow-book-container">
      <h3 className='heading'>Borrow Book for {userName}</h3>
      
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form className='borrow-book' onSubmit={handleSubmit(onSubmit)}>
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

        <div className="mb-3">
          <input type="text" className='form-control' {...register("bookId", { required: true })} placeholder='Book ID' />
          {errors.bookId && <p className='text-danger lead'>*Book ID is required</p>}
        </div>

        <div className="mb-3">
          <input type="date" className='form-control' {...register("issuedDate", { required: true })} placeholder='Issued Date' />
          {errors.issuedDate && <p className='text-danger lead'>*Issued Date is required</p>}
        </div>

        <div className="mb-3">
          <input type="date" className='form-control' {...register("returnDate", { required: true })} placeholder='Return Date' />
          {errors.returnDate && <p className='text-danger lead'>*Return Date is required</p>}
        </div>

        <button type="submit">Borrow</button>
      </form>
    </div>
  );
}

export default BorrowBook;