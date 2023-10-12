import React, { createContext, useEffect, useState } from 'react';
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
import Header from '../Header/Header';
import Cookies from 'js-cookie';
import { CookiesContext } from '../../context/Cookies';
import MyCart from '../MyCart/MyCart';



const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginRegisterForm />
  },
  {
    path: "/",
    element: <Dashboard />
  },
  {
    path: "/game/:gameID",
    element: <Game />
  },
  {
    path: "/checkout",
    element: <Checkout />
  },
  {
    path: "/cart",
    element: <MyCart />
  }
])

function App() {
  const [cookies, setCookies] = useState(JSON.parse(Cookies.get('cart') || "{}"));
  const updateCookies = (newValue) => {
    Cookies.set('cart', JSON.stringify(newValue));
    setCookies(newValue);
  }
  return <CookiesContext.Provider value={[cookies, updateCookies]}>
    <div className='App'>
      <Header />
      <RouterProvider router={router} />
    </div>
  </CookiesContext.Provider>
  
}

export default App;
