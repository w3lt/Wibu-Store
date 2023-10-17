import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { checkSession, displayPrice, fetchGameInfor } from "../../support";

import "./MyCart.css";
import windowsLogo from "../../assets/windows_logo.png";
import macOSLogo from "../../assets/macos_logo.png";
import Checkout from "../Checkout/Checkout";
import { SendGiftContext } from "../../context/SendGift";
import SendGift from "../SendGift/SendGift";
import { useNavigate } from "react-router-dom";

function MyCart() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState(null);
    const [gameIDs, setGameIDs] = useState([]);
    const [numberOfItems, setNumberOfItems] = useState(0);
    const [prices, setPrices] = useState(0);

    const [message, setMessage] = useState(null); // for sending gift
    const [receiver, setReceiver] = useState(null); // for sending gift

    const [isPaying, setIsPaying] = useState(false);
    const [isSendingGift, setIsSendingGift] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const finishMessageAndPay = () => {
        setIsSendingGift(false);
        setIsPaying(true);
    }

    useEffect(() => {
        if (isLoading) {
            (async () => {
                try {
                    const cart = JSON.parse(Cookies.get('cart') || '{}');
                    const items = [];
                    const gameIDs = [];
                    var numberOfItems = 0;
                    var prices = 0;
                    for(var item in cart) {
                        const data = await fetchGameInfor(item, ["thumbnail", "title", "supported_platforms", "types", "price"]);
                        items.push([data, cart[item]]);
                        gameIDs.push(item);
                        numberOfItems += cart[item];
                        prices += data.price;
                    }
                    setNumberOfItems(numberOfItems);
                    setItems(items);
                    setGameIDs(gameIDs);
                    setPrices(prices);

                    if ((await checkSession()).result) setIsLoggedIn(true);
                } catch (error) {
                    console.log(error);
                }
                
            }) ();
            setIsLoading(false);
        }
           
    }, [isPaying]);

    if (isLoading) return null;
    else return <div className="my-cart">
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "80%",
            margin: "0 auto"
        }}>
            <div className="title">My Cart</div>
            <div className="my-cart-content">
                <div className="items">
                    {items && items.map(([item, number], index) => {
                        return <div className="item" key={index}>
                            <div className="thumbnail" key={index}>
                                <img src={`data:image/jpeg;base64,${item.thumbnail}`} alt="" />
                            </div>
                            <div className="info">
                                <div style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "95%", margin: "auto 0"}}>
                                    <div>{item.title}</div>
                                    <div className="supported-platforms">
                                        {item.supported_platforms.map((platform, index) => {
                                            return <div className="platform-logo" key={index}>
                                                <img src={platform === 0 ? windowsLogo : macOSLogo} alt="" />
                                            </div>
                                        })}
                                    </div>
                                    <div className="types-container">
                                        {item.types.map((type, index) => {
                                            return <span key={index} className="type">{index !== 0 ? "," : ""} {type}</span>
                                        })}
                                    </div>
                                </div>
                                <div style={{marginLeft: "auto", marginRight: "10px"}}>{displayPrice(item.price)}</div>
                            </div>
                        </div>
                    })}
                </div>
                
                <div className="total-bill">
                    <div className="bill-title">Total: {numberOfItems} items</div>

                    <div>Price <span>${prices}</span></div>
                    <div>Discount <span>$0</span></div>

                    <div style={{
                        border: "1px solid white",
                        borderRadius: "1px",
                        margin: "10px 0"
                    }} />

                    <div>Subtotal <span>${prices}</span></div>

                    <div className="purchase-btn" onClick={() => {setIsPaying(true); document.addEventListener('keydown', e => {if (e.key === "Escape") setIsPaying(false);})}}>Purchare</div>
                    <div className="purchase-as-gift"><span>Or</span> <span onClick={() => {
                            if (isLoggedIn) {setIsSendingGift(true)} 
                            else navigate("/login");
                        }}>
                            Purchase as a Gift</span>
                    </div>
                </div>
            </div>
        </div>

        {(isPaying === true) && <div className="is-paying" tabIndex="0">
            <div 
                style={{
                    display: "flex", 
                    width: "41%", 
                    height: "41%",
                    backgroundColor: "white",
                    alignItems: "center",
                    // justifyContent: "center",
                    borderRadius: "10px",
                    padding: "0 10px",
                    color: "black"
                }}>
                <div style={{
                    width: "70%",
                    marginRight: "10px"
                }}>
                    <SendGiftContext.Provider value={[receiver, message]}>
                        <Checkout gameIDs={gameIDs} />
                    </SendGiftContext.Provider>
                </div>
                
                <div className="pay-bill">
                    <div><span>Price</span> <span>${prices}</span></div>                    
                    <div><span>Taxes</span> <span>10%</span></div>

                    <div style={{
                        border: "1px solid black",
                        borderRadius: "1px",
                        margin: "10px 0"
                    }} />

                    <div><span>Total</span> <span>${prices*1.1}</span></div>
                </div>
            </div>
        </div>}

        {(isSendingGift === true) && <div className="is-sending-gift">
            <div 
                style={{
                    display: "flex", 
                    width: "41%", 
                    height: "41%",
                    backgroundColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "10px",
                    backgroundColor: "#393939"
                }}>
                <SendGiftContext.Provider value={[setReceiver, setMessage, finishMessageAndPay]}>
                    <SendGift />
                </SendGiftContext.Provider>
            </div>
        </div>}
    </div>
}

export default MyCart;