import React, { useContext, useState } from "react";
import "./SendGift.css";
import { search } from "../../support";

import cancelSymbol from "../../assets/close-icon-white.png";
import { SendGiftContext } from "../../context/SendGift";

function SendGift() {

    const [chooseReceiver, setMessage, finishMessageAndPay] = useContext(SendGiftContext);

    const [receiver, setReceiver] = useState(null);

    const [keyword, setKeyword] = useState('');
    const [searchResult, setSearchResult] = useState(null);



    return <div className="send-gift">
        <div className="title">Send Gift</div>
        <div className="search-bar">
            <div>To: </div>
            {!receiver ? <div className={`to-friend ${searchResult && "is-searching"}`}>
                <input 
                    type="text" 
                    placeholder="Username or Email?" 
                    onChange={e => setKeyword(e.target.value)}
                />
            </div> : 
            <div className="receiver">
                <div className="avatar">
                    <img src={`data:image/jpeg;base64,${receiver.avatar}`} alt="" />
                </div>
                <div>{receiver.username}</div>
                <div className="cancel-btn" onClick={() => {setReceiver(null)}}><img src={cancelSymbol} alt="" /></div>
            </div>}
            
            {!receiver && <div className="search-btn" onClick={async () => {setSearchResult(await search(keyword, "user"));}}>Search</div>}

            <div className={`send-btn ${!receiver ? "not-allow-to-send" : "allow-to-send"}`} onClick={() => {chooseReceiver(receiver.uid); finishMessageAndPay();}}>Send</div>

            {searchResult && <div className="search-results">
                {searchResult.map((result, index) => {
                    return <div className="result" key={index} onClick={() => {setReceiver(result); setSearchResult(null);}}>
                        <div className="avatar">
                            <img src={`data:image/jpeg;base64,${result.avatar}`} alt="" />
                        </div>
                        <div>{result.username}</div>
                    </div>
                })}
            </div>}
        </div>
        
        <div className="message-container">
            <textarea placeholder="What do you want to say with your friend? (Optional)" onChange={e => setMessage(e.target.value)}></textarea>
        </div>
    </div>
}

export default SendGift;