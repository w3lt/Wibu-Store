import React, { useEffect, useState } from "react";

import "./Header.css";

import logo from "../../assets/logo.png";
import cartBtnSymbol from "../../assets/cart_button.png";
import cartBtnHoverSymbol from "../../assets/cart_button_hover.png";
import searchSymbol from "../../assets/search-icon.png";
import windowsLogo from "../../assets/windows_logo.png";
import macOSLogo from "../../assets/macos_logo.png";
import { checkSession, displayPrice, fetchUserInfor, logout, search } from "../../support";

export default function Header() {
    const [avatar, setAvatar] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [isBigEnough, setIsBigEnough] = useState(true);

    const [searchBarText, setSearchBarText] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    useEffect(() => {
        (async () => {
            const session = await checkSession();
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
    })

    const [isHoveringCartBtn, setIsHoveringCartBtn] = useState(false);
    const headerCategories = ["Latest", "Genre", "Collection", "Deal"];

    return (
        <div className="header-container">
            {isBigEnough ? 
                <div className="store-logo">Wibu <img src={logo} alt="" className="logo" /> Store</div>: 
                <div className="store-logo"><img src={logo} alt="" className="logo" /></div>}

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
                        onChange={e => setSearchBarText(e.target.value)}
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
                onMouseLeave={() => {setIsHoveringCartBtn(false)}}>
                {isHoveringCartBtn ? <img src={cartBtnHoverSymbol} alt="cart" /> : <img src={cartBtnSymbol} alt="cart" />}
            </div>

            {isLoggedIn ? 
                <div className="avatar-container" onClick={async () => {await logout(); window.location.href = window.location.href;}}>
                    <img src={`data:image/jpeg;base64,${avatar}`} className="avatar" alt="" />
                </div> :
                <div className="login-button" onClick={() => {window.location.href = "/login"}}>Login</div>}
        </div>
    )
}