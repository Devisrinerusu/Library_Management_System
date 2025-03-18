import React, { useContext } from 'react';
import './UserProfile.css';
import { userLoginContext } from '../../contexts/userLoginContext';

function UserProfile() {
  const { currentUser } = useContext(userLoginContext);

  console.log("Current User Data:", currentUser);

  // Check for overdue books
  const today = new Date();
  const overdueBooks = currentUser?.borrowedBooks?.filter(book => new Date(book.returnDate) < today) || [];

  return (
    <div className='user-profile'>
      <h1 className="dashboard">Dashboard</h1>

      <div className="p1 d-flex flex-wrap">
        <h5 className='d1'><strong>Username:</strong></h5>
        <h5>{currentUser?.username}</h5> 
      </div>

      <div className="p1 d-flex flex-wrap">
        <h5 className='d1'><strong>Email:</strong></h5>
        <h5>{currentUser?.email}</h5>
      </div>

      <div className="p1 d-flex flex-wrap">
        <h5 className='d1'><strong>Mobile:</strong></h5>
        <h5>{currentUser?.mobile}</h5>
      </div>

      {/* Show overdue warning if any books are overdue */}
      {/* {overdueBooks.length > 0 && (
        <p className="text-danger">
          ⚠️ Your books have been overdue ! Please return them before borrowing more.
        </p>
      )} */}

      {Array.isArray(currentUser?.borrowedBooks) && currentUser.borrowedBooks.length > 0 ? (
        <div className="borrowed-books">
          <h3 className="borrowed-title">Borrowed Books</h3>
          <ul>
            {currentUser.borrowedBooks.map((book, index) => (
              <li key={index} className="book-item">
                <strong>Book Name:</strong> {book.bookName} <br />
                <strong>Author:</strong> {book.author} <br />
                <strong>Edition:</strong> {book.edition} <br />
                <strong>Issued Date:</strong> {book.issuedDate} <br />
                <strong>Renewal Date:</strong> {book.renewalDate} <br />
                <strong>Return Date:</strong> {book.returnDate} <br />
                {/* Mark overdue books */}
                {new Date(book.returnDate) < today && <span className="text-danger"> (Overdue!)</span>}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className='no-books'>No borrowed books.</p>
      )}
    </div>
  );
}

export default UserProfile;
