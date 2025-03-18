import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ReturnBook.css";
import { useForm } from "react-hook-form";

function ReturnBook() {
  let { register, handleSubmit, formState: { errors } } = useForm();
  const { userId, userName,rollNo } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user details on component load
  useEffect(() => {
    async function fetchUser() {
      try {
        let res = await fetch(`http://localhost:5000/users-api/users/${rollNo}`);
        if (res.ok) {
          let data = await res.json();
          setUser(data.payload); // Correctly store user payload
        } else {
          setErrorMessage("User not found.");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }
    fetchUser();
  }, [userId]);

  // Handle book return
  async function returnUserBook(bookData) {
    if (!user || !user.borrowedBooks) {
      setErrorMessage("User data not available.");
      return;
    }

    // Case-insensitive check for the book in borrowedBooks
    let bookIndex = user.borrowedBooks.findIndex(
      (b) =>
        b.bookName.toLowerCase() === bookData.bookName.toLowerCase() &&
        b.author.toLowerCase() === bookData.author.toLowerCase() &&
        b.edition.toLowerCase() === bookData.edition.toLowerCase()
    );

    // If book is not found in user's borrowed list
    if (bookIndex === -1) {
      setErrorMessage(
        `You haven't borrowed "${bookData.bookName}" (Edition: ${bookData.edition}).`
      );
      return;
    }

    // Send request to backend to return book and increase book count
    let res = await fetch(
      `http://localhost:5000/users-api/users/removeBook/${userId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookData),
      }
    );

    let result = await res.json();

    if (!res.ok) {
      setErrorMessage(result.message || "Error returning the book.");
      return;
    }

    // If book is returned successfully, navigate to all users page
    navigate("/all-users");
  }

  // Handle form submission
  function onSubmit(data) {
    setErrorMessage(""); // Reset error message before submitting
    returnUserBook(data);
  }

  return (
    <div className="return-book-container">
      <h3 className="heading">Return Book for {userName}</h3>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <form className="return-book" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            {...register("bookName", { required: true })}
            placeholder="Book Name"
          />
          {errors.bookName && <p className="text-danger lead">*Book Name is required</p>}
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            {...register("author", { required: true })}
            placeholder="Author"
          />
          {errors.author && <p className="text-danger lead">*Author is required</p>}
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            {...register("edition", { required: true })}
            placeholder="Edition"
          />
          {errors.edition && <p className="text-danger lead">*Edition is required</p>}
        </div>

        <button type="submit">Return</button>
      </form>
    </div>
  );
}

export default ReturnBook;
