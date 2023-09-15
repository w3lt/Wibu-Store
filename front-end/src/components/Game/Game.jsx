import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import "./Game.css";
import { fetchGameInfor } from "../../support";

import logo from "../../assets/logo.png";
import cartIMG from "../../assets/cart.png";

const Game = React.memo(() => {

    const [gameInfor, setGameInfor] = useState(null);

    const [isLoggedIn, setIsInLoggedIn] = useState(false);

    const [isBigEnough, setIsBigEnough] = useState(true);

    const { gameID } = useParams();

    function handleResize() {
        if (window.innerWidth < 0.7 * window.screen.width) {
            setIsBigEnough(false);
        } else {
            setIsBigEnough(true);
        }
    }

    useEffect(() => {
        (async () => {setGameInfor(await fetchGameInfor(gameID))}) ();

        window.addEventListener('resize', handleResize);
    })

    const headerCategories = ["Latest", "Genre", "Collection", "Deal"];

    return (
        <div className="Game">
            <div className="header-container">
                {isBigEnough ? 
                    <div className="store-logo">Wibu <img src={logo} alt="" className="logo" /> Store</div>: 
                    <div className="store-logo"><img src={logo} alt="" className="logo" /></div>}

                {/* <div className="separate-line" /> */}

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

                <div className="cart">
                    <img src={cartIMG} alt="cart" />
                </div>

                {isLoggedIn ? 
                    <div className="avatar-container"><img src="" alt="avatar" /></div> :
                    <div className="login-button">Login</div>}

            </div>
        </div>
    )
});
export default Game;