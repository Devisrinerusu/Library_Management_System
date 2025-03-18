import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllUsers.css';

function AllUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      try {
        let res = await fetch("http://localhost:5000/users-api/users");
        let data = await res.json();
console.log(data);
let usersData=data.payload;
        // Sort users by branch, then by roll number
        usersData.sort((a, b) => {
          if (a.branch === b.branch) {
            return a.rollNo.localeCompare(b.rollNo);
          }
          return a.branch.localeCompare(b.branch);
        });

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="all-users-container">
      <h1>All Users</h1>
      <table className="users-table">
        <thead>
          <tr>
            <th>ROLL NUMBER</th>
            <th>Name</th>
            <th>Branch</th>
            <th>Email</th>
            <th>Borrowed Books</th>
            <th>Add Books</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id || user.rollNo}>
              <td>{user.rollNo}</td>
              <td>{user.username}</td>
              <td>{user.branch}</td>
              <td>{user.email}</td>
              <td>{Array.isArray(user.borrowedBooks) && user.borrowedBooks.length > 0 ? user.borrowedBooks.map(book => book.bookName).join(", ") : "None"}</td>
              <td>
                <div className="d-flex">
                <p className="add-book" onClick={() => navigate(`/borrow-book/${user.username}/${user.rollNo}/${user._id}`)}>Borrow</p>
                <p className="del-book" onClick={() => navigate(`/return-book/${user.username}/${user.rollNo}/${user._id}`)}>Return</p>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllUsers;
