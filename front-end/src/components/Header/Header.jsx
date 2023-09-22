import React, { useState } from "react";

import "./Header.css";

import logo from "../../assets/logo.png";
import cartBtnSymbol from "../../assets/cart_button.png";
import cartBtnHoverSymbol from "../../assets/cart_button_hover.png";
import { logout } from "../../support";

export default function Header({ avatar, isLoggedIn, isBigEnough}) {

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

            <div className="search-bar">
                <input type="text"
                    placeholder="Search"
                />
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