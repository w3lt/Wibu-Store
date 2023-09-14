import React, { useEffect, useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  useNavigate,
} from "react-router-dom"; 

import './App.css';
import LoginRegisterForm from '../Login-Register-Form/LoginRegisterForm';
import Dashboard from '../Dashboard/Dashboard';


const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginRegisterForm />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  }
])

function App() {
  return <div className='App'><RouterProvider router={router} /></div>
}

export default App;
