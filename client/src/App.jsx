import React from "react";
import RootLayout from "./RootLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/home/Home";
import Header from "./components/header/Header";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import UserProfile from "./components/user-profile/UserProfile";
import AddBooks from "./components/add-books/AddBooks";
import SearchPage from "./components/search-page/SearchPage";
import AllUsers from "./components/all-users/AllUsers";
import BorrowBook from "./components/borrow-book/BorrowBook";
import ReturnBook from "./components/return-book/ReturnBook";
import AddLibrarians from "./components/add-librarians/AddLibrarians";

function App(){

  const browserRouter=createBrowserRouter([
    {
      path:'',
      element:<RootLayout/>,
      children:[
         {
          path:'',
          element:<Home />
         },
         {
          path:'login',
          element:<Login />
         },
         {
          path:'register',
          element:<Register />
         },
         {
          path:'user-profile',
          element:<UserProfile />
         },
         {
          path:'/add-books',
          element:<AddBooks />
         },
         {
          path:'/search-page',
          element:<SearchPage />
         },
         {
          path:'/all-users',
          element:<AllUsers />
         },
         {
          path:'/borrow-book/:userName/:rollNo/:userId',
          element:<BorrowBook />        
         },
         {
          path:'/return-book/:userName/:rollNo/:userId',
          element:<ReturnBook />
         },
         {
          path:'/add-librarians',
          element:<AddLibrarians />
         }
      ]
      
    }
  ])

  return (
    <RouterProvider router={browserRouter} />
  )
}


export default App;
