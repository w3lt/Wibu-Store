import React, { useEffect, useState } from "react";

import "./Dashboard.css";
import Header from "../Header/Header";



const Dashboard = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [avatar, setAvatar] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isBigEnough, setIsBigEnough] = useState(true);

    const [advertisementBanner, setAdvertisementBanner] = useState(null);

    const [bestDealForYou, setBestDealForYou] = useState(Array(5).fill(null));
    const [freeToPlay, setFreeToPlay] = useState(Array(5).fill(null));

    return (
        <div className="dashboard">
            <Header avatar={avatar} isLoggedIn={isLoggedIn} isBigEnough={isBigEnough} />
            <div className="advertisement-banner-container">
                <img src={advertisementBanner} alt="" />
            </div>

            <div className="best-deal-for-you-container">
                <div>Best Deal For You</div>
                {bestDealForYou.map(game => {
                    return (
                        <div className="best-deal-for-you">

                        </div>
                    )
                })}
            </div>

            <div className="free-to-play-container">
                {freeToPlay.map(game => {
                    return (
                        <div className="free-to-play">

                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default Dashboard;