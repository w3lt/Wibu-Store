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
import AccountSettings from '../AccountSettings/AccountSettings';
import { checkSession } from '../../support';
import { UserContext } from '../../context/User';



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
  },
  {
    path: "/account-settings",
    element: <AccountSettings />
  }
])

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cookies, setCookies] = useState(JSON.parse(Cookies.get('cart') || "{}"));
  const updateCookies = (newValue) => {
    Cookies.set('cart', JSON.stringify(newValue));
    setCookies(newValue);
  }

  useEffect(() => {
    if (isLoading) {
      (async () => {
        const result = await checkSession();
        setIsLoggedIn(result.result);
        setIsLoading(true);
      }) ();
    }
    
  })
  return <CookiesContext.Provider value={[cookies, updateCookies]}>
    <UserContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
      <div className='App'>
        <Header />
        <RouterProvider router={router} />
      </div>
    </UserContext.Provider>
  </CookiesContext.Provider>
  
}

export default App;
