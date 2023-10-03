import React, { useEffect, useState } from "react";

import "./Dashboard.css";
import Header from "../Header/Header";
import { execRequest, getDatas, getTopBanners } from "../../support";

import nextBannerSymbol from "../../assets/next_banner.png";
import previousBannerSymbol from "../../assets/previous_banner.png";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [avatar, setAvatar] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isBigEnough, setIsBigEnough] = useState(true);

    const [topBanners, setTopBanners] = useState([]);
    const [topBannerIndex, setTopBannerIndex] = useState(0);

    const [bestDealForYou, setBestDealForYou] = useState(Array(5).fill({}));
    const [freeToPlay, setFreeToPlay] = useState(Array(5).fill(null));

    const otherTags = ["News", "Trending", "Top Seller", "Most Played", "Top Upcoming"];
    const [otherTagsData, setOtherTagsData] = useState(Array(5).fill({}));
    const [selectedTag, setSelectedTag] = useState(-1);

    useEffect(() => {
        (async () => {
            if (isLoading) {
                // top banners
                const topBanners = await getTopBanners();
                setTopBanners(topBanners);

                // best deal for you
                const bestDealForYou = await getDatas('best-deal-for-you');
                setBestDealForYou(bestDealForYou);

                // free to play
                const freeToPlay = await getDatas('free-to-play');
                setFreeToPlay(freeToPlay);

                // const topSellersResponse = await execRequest("/datas/top-sellers/year", "POST", {start_index: 0, count: 5});
                // console.log(topSellersResponse);

                setIsLoading(false);
            }
            
        }) ();
    }, []);

    if (isLoading) return null;
    else return (
        <div className="dashboard">
            <Header avatar={avatar} isLoggedIn={isLoggedIn} isBigEnough={isBigEnough} />
            {!isLoading &&
            <div style={{position: "relative", top: "52px", display: "flex", flexDirection: 'column', alignItems: "center", backgroundColor: "#302F2F", color: "white"}}>
                <div style={{display: "flex", flexDirection: "column", width: "70%"}}>
                    <div className="top-banners-container">
                        <div className={`navigate-btn previous-btn ${topBannerIndex === 0 ? "disabled" : ""}`} onClick={() => setTopBannerIndex(previous => previous-1)}>
                            <img src={previousBannerSymbol} alt="" />
                        </div>

                        <img src={`data:image/jpeg;base64,${topBanners[topBannerIndex]}`} alt=""/>

                        <div className={`navigate-btn next-btn ${topBannerIndex === topBanners.length-1 ? "disabled" : ""}`} onClick={() => setTopBannerIndex(previous => previous+1)}>
                            <img src={nextBannerSymbol} alt="" />
                        </div>

                        <span
                            onAnimationIteration={() => setTopBannerIndex(previous => (previous+1)%topBanners.length)}
                            style={{
                                position: "absolute",
                                display: "block",
                                bottom: "10px",
                                left: "50%",
                                transform: "translateX(-25px)",
                                width: "50px",
                                height: "5px",
                                borderRadius: "10px",
                                border: "solid 1px white"
                            }}
                        >
                            <span className="switch-banner-tab" />
                        </span>
                        
                    </div>

                    <div className="best-deal-for-you-container">
                        <div className="title">Best Deal For You</div>
                        <div className="games">
                            {bestDealForYou.map((game, index) => {
                                return (
                                    <div key={index} className="best-deal-for-you" style={index === 4 ? {marginRight: "0"} : {}}>
                                        <div className="cover-img" onClick={() => navigate(`/game/${game.id}`)}>
                                            <img src={`data:image/jpeg;base64,${game.cover_img}`} alt="" />
                                        </div>
                                        <div style={{fontSize: "1.2rem", fontWeight: "500"}}>{game.title}</div>
                                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                            <div className="sale-percentage">{Math.round((game.price / game.original_price)*100)}%</div>
                                            <div style={{marginRight: "auto", textDecoration: "line-through"}}>${game.original_price}</div>
                                            <div>${game.price}</div>
                                        </div>
                                        
                                    </div>
                                )
                            })}
                        </div>
                        
                    </div>

                    <div className="free-to-play-container">
                        <div className="title">Free To Play</div>
                        <div className="games">
                            {freeToPlay.map((game, index) => {
                                return (
                                    <div key={index} className="free-to-play" style={index === 4 ? {marginRight: "0"} : {}}>
                                        <div className="cover-img" onClick={() => navigate(`/game/${game.id}`)}>
                                            <img src={`data:image/jpeg;base64,${game.cover_img}`} alt="" />
                                            <div style={{fontSize: "1.2rem", fontWeight: "500"}}>{game.title}</div>
                                            <div>Free</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="other-tags-container">
                        <div className="tag-names">
                            {otherTags.map((tag, index) => (
                                <div key={index} onClick={async () => {
                                    
                                    try {
                                        switch (index) {
                                            case 0:
                                                setOtherTagsData(await getDatas('news'));
                                                break;
                                            case 1:
                                                setOtherTagsData(await getDatas('trending'));
                                                break;
                                            case 2:
                                                setOtherTagsData(await getDatas('top-seller'));
                                                break;
                                            case 3:
                                                setOtherTagsData(await getDatas('most-played'));
                                                break;
                                            case 4:
                                                setOtherTagsData(await getDatas('top-coming'));
                                                break;
                                        }
                                        console.log(otherTagsData);
                                        setSelectedTag(index);
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }}>
                                    {tag}
                                    <span />
                                </div>
                            ))}
                        </div>

                        <div>
                            
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
};

export default Dashboard;