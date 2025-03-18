import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.css';
import UserLoginStore from './contexts/UserLoginStore.jsx';
import LibrarianLoginStore from './contexts/LibrarianLoginStore'

createRoot(document.getElementById('root')).render(
  <UserLoginStore>
    <LibrarianLoginStore>
    <App />
    </LibrarianLoginStore>
  </UserLoginStore>,
)


