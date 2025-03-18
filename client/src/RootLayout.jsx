import React from 'react'
import Header from "./components/header/Header"
import { Outlet } from 'react-router-dom'

function RootLayout() {
  return (
    <div>
        <Header />
        <div style={{minHeight:'100vh'}}>
            <Outlet />
        </div>
    </div>
  )
}

export default RootLayout