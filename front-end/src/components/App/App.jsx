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
import Game from '../Game/Game';
import Checkout from '../Checkout/Checkout';


const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginRegisterForm />
  },
  {
    path: "/dashboard",
    element: <Dashboard />
  },
  {
    path: "/game/:gameID",
    element: <Game />
  },
  {
    path: "/checkout",
    element: <Checkout />
  }
])

function App() {
  return <div className='App'><RouterProvider router={router} /></div>
}

export default App;
