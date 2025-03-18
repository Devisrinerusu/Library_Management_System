import React, { useState } from 'react';
import './SearchPage.css';

function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]); // Correct state variable
  const [errorMessage, setErrorMessage] = useState('');

  // Handle book search with backend API
  async function handleSearch() {
    setErrorMessage('');
    setBooks([]);

    if (!searchQuery.trim()) {
      setErrorMessage('Please enter a book name or book name + author + edition.');
      return;
    }

    // Split searchQuery to extract bookName, author, and edition
    let [bookName, author, edition] = searchQuery.split('+').map((str) => str.trim());

    // Build URL based on provided values
    let apiUrl = `http://localhost:5000/books-api/books/${bookName}`;

    if (author) apiUrl += `/${author}`;
    if (edition) apiUrl += `/${edition}`;

    try {
      let res = await fetch(apiUrl);
      if (!res.ok) {
        throw new Error('Book not available.');
      }

      let data = await res.json();
      setBooks(data); // Store fetched books
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <div className="search-page">
      <h3 className="heading">Search for Books</h3>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter Book Name or Book Name + Author + Edition"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="book-results">
        {books.length > 0 && // Correctly referencing `books` here
          books.map((book, index) => (
            <div key={index} className="book-card">
              <h4>{book.bookName} (Edition: {book.edition || 'N/A'})</h4>
              <p>Author: {book.author}</p>
              <p>Branch: {book.branch}</p>
              <p>{book.noOfBooks >= 1 ? `Available (${book.noOfBooks})` : 'Not Available'}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SearchPage;
