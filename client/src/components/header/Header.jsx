import React, { useContext } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { PiSignInBold } from "react-icons/pi";
import { MdGroupAdd } from "react-icons/md";
import { userLoginContext } from '../../contexts/userLoginContext';
import { librarianLoginContext } from '../../contexts/librarianLoginContext';
import { RiLogoutBoxLine } from "react-icons/ri";
import { TbUserSquareRounded } from "react-icons/tb";
import { BsSearch } from "react-icons/bs";
import { useEffect } from 'react';

function Header() {
  const { userLoginStatus, logoutUser } = useContext(userLoginContext);
  const { librarianLoginStatus, logoutLibrarian } = useContext(librarianLoginContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (userLoginStatus) {
      logoutUser();
    } else if (librarianLoginStatus) {
      logoutLibrarian();
    }
    navigate('/'); // Redirect to home after logout
  };

  useEffect(() => {
    console.log("Header Updated - userLoginStatus:", userLoginStatus);
  }, [userLoginStatus]);

  return (
    <div className="header">
      <div className='header d-flex flex-wrap justify-content-between text-center'>
        <div className="icon d-flex flex-wrap">
          <img src="https://png.pngtree.com/png-clipart/20230916/original/pngtree-flat-books-icon-linear-illustration-vector-png-image_12263363.png" alt="BooksNest Logo" />
          <h1 className='logo my-3'>
            <Link to='/' className='nav-link'>
              Books<span>Nest</span>
            </Link>
          </h1>
        </div>

        <ul className="nav">
          {!userLoginStatus && !librarianLoginStatus ? (
            <>
              <li className="nav-item">
                <Link to='login' className='h6 nav-link text-white'>
                  <PiSignInBold className='m-1 login-icon'/> Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to='register' className='h6 nav-link text-white'>
                  <MdGroupAdd className='m-1 signin-icon'/> Sign Up
                </Link>
              </li>
            </>
          ) : librarianLoginStatus ? (
            // If librarian is logged in, only show logout button
            <>
              <li className="nav-item">
                <button className='h6 nav-link text-white' onClick={handleLogout}>
                  <RiLogoutBoxLine className='m-1 logout-icon' /> Logout
                </button>
              </li>
            </>
          ) : (
            // If user is logged in, show logout, user profile, and search icons
            <>
              <li className="nav-item">
                <button className='h6 nav-link text-white' onClick={handleLogout}>
                  <RiLogoutBoxLine className='m-1 logout-icon' /> Logout
                </button>
              </li>
              <li>
                <Link to='user-profile' className='nav-link text-white'>
                  <TbUserSquareRounded className='m-1 user-icon mt-3'/>
                </Link>
              </li>
              <li className="nav-item">
                <Link to='search-page' className='h6 nav-link text-white'>
                  <BsSearch className='mt-2 side-icon'/>
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Header;
