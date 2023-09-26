import React, { useEffect, useState } from "react";

import "./Dashboard.css";
import Header from "../Header/Header";
import { execRequest } from "../../support";



const Dashboard = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [avatar, setAvatar] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isBigEnough, setIsBigEnough] = useState(true);

    const [advertisementBanner, setAdvertisementBanner] = useState(null);

    const [bestDealForYou, setBestDealForYou] = useState(Array(5).fill(null));
    const [freeToPlay, setFreeToPlay] = useState(Array(5).fill(null));

    useEffect(() => {
        (async () => {
            const bestDealForYouResponse = await execRequest("/datas/best-deal-for-you", "POST", {number: 10});
            console.log(bestDealForYouResponse);
            const topSellersResponse = await execRequest("/datas/top-sellers", "POST", {start_index: 0, count: 5});
            console.log(topSellersResponse);
        }) ();
    }, []);

    return (
        <div className="dashboard">
            <Header avatar={avatar} isLoggedIn={isLoggedIn} isBigEnough={isBigEnough} />
            <div className="advertisement-banner-container">
                <img src={advertisementBanner} alt="" />
            </div>

            <div className="best-deal-for-you-container">
                <div>Best Deal For You</div>
                {bestDealForYou.map((game, index) => {
                    return (
                        <div key={index} className="best-deal-for-you">

                        </div>
                    )
                })}
            </div>

            <div className="free-to-play-container">
                {freeToPlay.map((game, index) => {
                    return (
                        <div key={index} className="free-to-play">

                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default Dashboard;