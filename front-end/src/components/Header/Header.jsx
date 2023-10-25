import React, { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

import "./Header.css";

import logo from "../../assets/logo.png";
import cartBtnSymbol from "../../assets/cart_button.png";
import cartBtnHoverSymbol from "../../assets/cart_button_hover.png";
import searchSymbol from "../../assets/search-icon.png";
import windowsLogo from "../../assets/windows_logo.png";
import macOSLogo from "../../assets/macos_logo.png";
import { checkSession, displayPrice, fetchUserInfor, logout, search } from "../../support";
import { CookiesContext } from "../../context/Cookies";

export default function Header() {
    const [avatar, setAvatar] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [isBigEnough, setIsBigEnough] = useState(true);

    const [searchBarText, setSearchBarText] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    const [cookies, updateCookies] = useContext(CookiesContext);

    const calculateCartNumber = () => {
        var cartNumber = 0;
        for (var item in cookies) {
            cartNumber += cookies[item];
        }
        return cartNumber;
    }  

    const [cartNumber, setCartNumber] = useState(0);

    const [isDropped, setIsDropped] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setCartNumber(calculateCartNumber());

        if (isLoading) {
            (async () => {
                const session = await checkSession();
                console.log(session);
                if (session.result) {
                    setAvatar(await fetchUserInfor(session.uid, "avatar"));
                    setIsLoggedIn(true);
                }
            }) ();
            window.addEventListener('resize', () => {
                if (window.innerWidth < 0.7 * window.screen.width) {
                    setIsBigEnough(false);
                } else {
                    setIsBigEnough(true);
                }
            })

            setIsLoading(false);
        }
        
    }, [cookies]);

    const [isHoveringCartBtn, setIsHoveringCartBtn] = useState(false);
    const headerCategories = ["Latest", "Genre", "Collection", "Deal"];

    return (
        <div className="header-container">
            {isBigEnough ? 
                <div className="store-logo" onClick={() => {window.location.href = "/"}}>Wibu <img src={logo} alt="" className="logo" /> Store</div>: 
                <div className="store-logo" onClick={() => {window.location.href = "/"}}><img src={logo} alt="" className="logo" /></div>
            }

            <div className="header-categories-container">
                {headerCategories.map((category, index) => (
                    <div className="header-category" key={index}>{category}</div>
                ))}
            </div>

            <div className="search">
                <div className="search-bar">
                    <input type="text"
                        placeholder="Search"
                        value={searchBarText}
                        onChange={e => {setSearchBarText(e.target.value); if (e.target.value.length === 0) setSearchResults(null);}}
                    />
                    <img src={searchSymbol} alt="" onClick={async () => {setSearchResults(await search(searchBarText))}} />
                </div>

                {searchResults && <div className="results">
                    {searchResults.map((result, index) => {
                        return <div key={index} onClick={() => {window.location.href = `/game/${result.id}`}} className="result">
                            <div className="cover-img">
                                <img src={`data:image/jpeg;base64,${result.cover_img}`} alt="" />
                            </div>
                            <div className="info" style={{marginLeft: "0", flexGrow: "1"}}>
                                <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
                                    <div style={{marginBottom: "auto"}}>{result.title}</div>
                                    <div className="supported-platforms">
                                        {result.supported_platforms.map((platform, index) => {
                                            return <div className="platform-logo" key={index}>
                                                <img src={platform === 0 ? windowsLogo : macOSLogo} alt="" />
                                            </div>
                                        })}
                                    </div>
                                </div>
                                <div style={{marginLeft: "auto"}}>{displayPrice(result.price)}</div>
                            </div>
                        </div>
                    })}
                </div>}
            </div>

            <div className="cart"
                onMouseEnter={() => {setIsHoveringCartBtn(true)}}
                onMouseLeave={() => {setIsHoveringCartBtn(false)}}
                onClick={() => {window.location.href = "/cart"}}>
                {isHoveringCartBtn ? <img src={cartBtnHoverSymbol} alt="cart" /> : <img src={cartBtnSymbol} alt="cart" />}
                {cartNumber !== 0 && <div className="cart-number">
                    {cartNumber}
                </div>}
            </div>

            {isLoggedIn ? 
                <div style={{
                    display: "flex"
                }}>
                    <div className="avatar-container">
                        <img src={`data:image/jpeg;base64,${avatar}`} className="avatar" alt="" onClick={() => {setIsDropped(previous => !previous)}} />
                    </div>
                    
                    {(isDropped === true) && <div className="drop-box">
                        <div onClick={() => {window.location.href = "/account-settings"}}>Account Settings</div>
                        <div onClick={async () => {await logout(); window.location.href = window.location.href;}}>Logout</div>
                    </div>}
                </div> :
                <div className="login-button" onClick={() => {window.location.href = "/login"}}>Login</div>}
        </div>
    )
}