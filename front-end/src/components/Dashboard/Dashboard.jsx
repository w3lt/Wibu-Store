import React, { useEffect, useState } from "react";

import "./Dashboard.css";
import { displayPrice, getDatas, getTopBanners } from "../../support";

import nextBannerSymbol from "../../assets/next_banner.png";
import previousBannerSymbol from "../../assets/previous_banner.png";
import { useNavigate } from "react-router-dom";

import windowsLogo from "../../assets/windows_logo.png";
import macOSLogo from "../../assets/macos_logo.png";


const Dashboard = () => {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);

    const [topBanners, setTopBanners] = useState([]);
    const [topBannerIndex, setTopBannerIndex] = useState(0);

    const [bestDealForYou, setBestDealForYou] = useState(Array(5).fill({}));
    const [freeToPlay, setFreeToPlay] = useState(Array(5).fill(null));

    const otherTags = ["News", "Trending", "Top Seller", "Top Upcoming"];
    const [otherTagsData, setOtherTagsData] = useState(null);
    const [selectedTag, setSelectedTag] = useState(0);

    useEffect(() => {
        (async () => {
            if (isLoading) {
                // try {
                    // top banners
                    const topBanners = await getTopBanners();
                    setTopBanners(topBanners);

                    // best deal for you
                    const bestDealForYou = await getDatas('best-deal-for-you');
                    setBestDealForYou(bestDealForYou);

                    // free to play
                    const freeToPlay = await getDatas('free-to-play');
                    setFreeToPlay(freeToPlay);

                    setOtherTagsData(await getDatas("news"));

                    setIsLoading(false);
                // } catch (error) {
                //     console.log(error);
                // }
            }
            
        }) ();
    }, []);

    if (isLoading) return null;
    else return (
        <div className="dashboard">
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
                                        <div style={{fontSize: "1.3rem", fontWeight: "500"}}>{game.title}</div>
                                        <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                            <div className="sale-percentage">{Math.round((game.price / game.original_price)*100)}%</div>
                                            <div style={{marginRight: "auto", textDecoration: "line-through"}}>${game.original_price}</div>
                                            <div>{displayPrice(game.price)}</div>
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
                                        </div>
                                        <div style={{fontSize: "1.3rem", fontWeight: "500"}}>{game.title}</div>
                                        <div>Free</div>
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
                                        setOtherTagsData(await getDatas(tag.toLocaleLowerCase().replace(" ", "-")));
                                        setSelectedTag(index);
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }}>
                                    {tag}
                                    <span style={selectedTag === index ? {width: "30px"} : {}} />
                                </div>
                            ))}
                        </div>

                        {otherTagsData && <div className="other-tags-data">
                            {otherTagsData.map((game, index) => {
                                return (
                                    <div key={index} className="game" style={index === 4 ? {marginRight: "0"} : {}}>
                                        <div className="thumbnail" onClick={() => navigate(`/game/${game.id}`)}>
                                            <img src={`data:image/jpeg;base64,${game.thumbnail}`} alt="" />
                                        </div>
                                        <div className="info">
                                            <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
                                                <div className="game-title">{game.title}</div>
                                                <div className="supported-platforms">
                                                    {game.supported_platforms.map((platform, index) => {
                                                        return <div className="platform-logo" key={index}>
                                                            <img src={platform === 0 ? windowsLogo : macOSLogo} alt="" />
                                                        </div>
                                                    })}
                                                </div>
                                                <div className="types-container">
                                                    {game.types.map((type, index) => {
                                                        return <span key={index} className="type">{index !== 0 ? "," : ""} {type}</span>
                                                    })}
                                                </div>
                                            </div>  

                                            <div className="price">
                                                {displayPrice(game.price)}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>}
                    </div>
                </div>
            </div>}
        </div>
    )
};

export default Dashboard;