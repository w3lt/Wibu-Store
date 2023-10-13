import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { displayPrice, fetchGameInfor } from "../../support";

import "./MyCart.css";
import windowsLogo from "../../assets/windows_logo.png";
import macOSLogo from "../../assets/macos_logo.png";
import Checkout from "../Checkout/Checkout";

function MyCart() {
    const [isLoading, setIsLoading] = useState(true);
    const [items, setItems] = useState(null);
    const [gameIDs, setGameIDs] = useState([]);
    const [numberOfItems, setNumberOfItems] = useState(0);
    const [prices, setPrices] = useState(0);

    const [isPaying, setIsPaying] = useState(false);

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
                        const data = await fetchGameInfor(cart[item], ["thumbnail", "title", "supported_platforms", "types", "price"]);
                        items.push([data, cart[item]]);
                        gameIDs.push(item);
                        numberOfItems += cart[item];
                        prices += data.price;
                    }
                    setNumberOfItems(numberOfItems);
                    setItems(items);
                    setGameIDs(gameIDs);
                    setPrices(prices);
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
                    <div className="purchase-as-gift"><span>Or</span> <span>Purchase as a Gift</span></div>
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
                    <Checkout gameIDs={gameIDs} />
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
        
    </div>
}

export default MyCart;