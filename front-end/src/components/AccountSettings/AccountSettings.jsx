import React, { useContext, useEffect, useState } from "react";
import "./AccountSettings.css";

import { changePassword, fetchTransactionList, getUserDatas, requestDeleteAccount, submitUserProfile } from "../../support";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/User";

function AccountSettings() {

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const isLoggedIn = useContext(UserContext)[0];
    const [avatar, setAvatar] = useState('');
    const [userProfile, setUserProfile] = useState({
        username: '',
        email: '',
        fullname: '',
        tel: ''
    })

    const [transactionList, setTransactionList] = useState(null);
    const divideTransactions = (transactionList) => {
        const result = {};
        const days = [];
        for (let i=0; i<transactionList.length; ++i) {
            const day = transactionList[i].time.split('T')[0];
            if (result.hasOwnProperty(day)) result[day].push({id: transactionList[i].id, amount: transactionList[i].amount});
            else {result[day] = [{id: transactionList[i].id, amount: transactionList[i].amount}]};
            if (!days.includes(day)) {
                days.push(day);
            }
        }

        for (var day in result) {
            result[day].sort((a, b) => b.id - a.id);
        }

        days.sort().reverse();
        return {days: days, transactionList: result};
    }

    const [isDeleting, setIsDeleting] = useState(false);
    const [verify, setVerify] = useState('');

    const [settingId, setSettingId] = useState(0);
    const [changeAvatarMenuPosition, setChangeAvatarMenuPosition] = useState(null);
    const [newPassword, setNewPassword] = useState(['', '']);
    const [isAllowed, setIsAllowed] = useState(newPassword[0].length !== 0 && newPassword[0] === newPassword[1]);
    // settingId is the id indicating the current setting tag
    // 0 -> my account
    // 1 -> password & security
    // 2 -> be a publisher
    // 3 -> payment management
    // 4 -> payment history
    // 5 -> preferences
    // 6 -> notifications

    function handleDropAvatar(e) {
        e.preventDefault();

        const files = e.dataTransfer.files;
        if (files.length > 1) {
            alert("Please just drop 1 images");
        } else {
            const file = files[0];
            if (file.type.substring(0, 5) !== "image") alert("Please chose an image!");
            else {
                const fileReader = new FileReader();

                fileReader.onload = () => {
                    setUserProfile(previous => {previous.avatar = fileReader.result; return previous;});
                }

                fileReader.readAsDataURL(file);
            }
        }
    }

    async function handleProfileChange() {
        try {
            const formData = new FormData();
            
            const avatarBlob = await (await fetch(avatar)).blob();
            formData.append('avatar', avatarBlob);
            for (var key in userProfile) {
                formData.append(key, userProfile[key]);
            }

            const result = await submitUserProfile(formData);
            if (result === true) {
                navigate(0);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function requireChangePassword() {
        const result = await changePassword(newPassword[0]);
        if (result) navigate(0);
    }

    useEffect(() => {
        if (isLoggedIn) {
            if (isLoading) {
                (async () => {
                    document.oncontextmenu = e => {
                        e.preventDefault();
                        console.log(e.target.className);
                        if (e.target.className === "avatar-container" || e.target.className === "new-avatar") {
                            setChangeAvatarMenuPosition([e.clientX, e.clientY]);
                        } else {
                            setChangeAvatarMenuPosition(null);
                        }
                    }
    
                    const data = await getUserDatas("avatar", "username", "email", "fullname", "tel");
                    setAvatar(`data:image/jpeg;base64,${data.avatar}`);
                    setUserProfile(previous => {
                        for (var key in previous) {
                            if (key !== 'avatar') {
                                previous[key] = data[key];
                            }
                        }
    
                        return previous;
                    })
    
                    setIsLoading(false);
                }) ();
            }
        } else {
            navigate('/login');
        }
        
    })

    console.log(transactionList);

    if (isLoading) return null;
    return <div className="settings-container">
        <div className="settings-bar">
            <div className="user-settings">
                <div className="title">User Settings</div>
                {["My Account", "Password & Security"].map((tagName, index) => {
                    return <div key={index} className={`${settingId === index ? "is-chosen" : ""}`} onClick={() => {setSettingId(index)}}>{tagName}</div>
                })}
            </div>

            <div className="payment-settings">
                <div className="title">Payment Settings</div>
                {["Transactions"].map((tagName, index) => {
                    return <div key={index} className={`${settingId === index+2 ? "is-chosen" : ""}`} onClick={async () => {setSettingId(index+2); try{const result = await fetchTransactionList(); setTransactionList(divideTransactions(result))} catch (error) {console.log(error);}}}>{tagName}</div>
                })}
            </div>

            {/* <div className="store-settings">
                <div className="title">Store Settings</div>
                {["Preferences", "Notifications"].map((tagName, index) => {
                    return <div key={index} className={`${settingId === index+3 ? "is-chosen" : ""}`} onClick={() => {setSettingId(index+3)}}>{tagName}</div>
                })}
            </div> */}
        </div>

        <div className="settings-content">
            {settingId === 0 && <div className="my-account">
                <div className="profile">
                    <div className="profile-picture">
                        <div className="title">Profile Picture</div>
                        <div className="avatar-container" onDragOver={e => {e.preventDefault();}} onDrop={handleDropAvatar}>{avatar !== '' ? <img className="new-avatar" src={avatar} alt="" /> : <span>Change Avatar</span>}</div>
                    </div>
                </div>

                <div className="profile-changes">
                    {["Username", "Full Name", "Email", "Tel"].map((tagName, index) => {
                        const name = tagName.toLocaleLowerCase().replace(' ', '');
                        var type;
                        if (index === 3) type = "tel";
                        else if (index === 2) type = "email";
                        else type = "text";
                        return <div key={index} className="profile-change">
                            <div>{tagName}</div>
                            <div><input type={type} defaultValue={userProfile[name]} onChange={e => {setUserProfile(previous => {previous[name] = e.target.value; return previous;})}} /></div>
                        </div>
                    })}
                </div>

                <div className="save-btn" onClick={handleProfileChange}>Save</div>


                <div className="break-line" />

                <div className="delete-account">
                    <div className="title">Delete Account</div>
                    <div>If you request to delete your account, your account will be deleted immediately. You cannot anymore login to your account. All your information including personal information and games that you have purchased will be deleted. This action is <b>IRREVERSIBLE</b>.</div>
                </div>

                <div className="delete-btn" onClick={() => {setIsDeleting(true);}}>Delete Account</div>

                {changeAvatarMenuPosition && settingId === 0 && <div className="change-avatar-menu"
                style={{position: "absolute", zIndex: "100", left: `${changeAvatarMenuPosition[0]}px`, top: `${changeAvatarMenuPosition[1]}px`, backgroundColor: "#434242", padding: "5px"}}>
                    <div onClick={() => {document.getElementById('file-input').click();}}>Upload Image <input type="file" accept="image/*" id="file-input" style={{display: "block", width: "0", height: "0"}} onChange={e => {const fileReader = new FileReader(); fileReader.onload = () => {setAvatar(fileReader.result);}; fileReader.readAsDataURL(e.target.files[0]); setChangeAvatarMenuPosition(null)}} /></div>
                    <div onClick={() => {setAvatar(''); setChangeAvatarMenuPosition(null)}}>Remove Avatar</div>
                </div>}
            </div>}

            {settingId === 1 && <div className="password-security">
                <div className="change-password">
                    {["New Password", "Confirm New Password"].map((tagName, index) => {
                        return <div key={index}>
                            <div>{tagName}</div>
                            <div><input type="password" defaultValue={newPassword[index]} onChange={e => {setNewPassword(previous => {previous[index] = e.target.value; return previous;}); setIsAllowed(newPassword[0].length !== 0 && newPassword[0] === newPassword[1]);}} /></div>
                        </div>
                    })}

                    <div className={`change-password-btn ${isAllowed ? "allowed" : "not-allowed"}`} onClick={requireChangePassword}>Change Password</div>
                </div>
                
                {/* <div className="break-line" />

                <div className="two-fa-authentication">
                    <div className="title">Two-Factor Authentication</div>
                    <div>Two-factor authentication (2FA) can be used to help protect your account from unauthorized access. You’ll be required to enter a security code each time you sign in.</div>
                    <div className="enable-btn">Enable 2FA</div>
                </div> */}
            </div>}

            {settingId === 2 && <div className="payment-history">
                {/* <div className="search">
                    <div><input type="text" placeholder="Search for transaction" /></div>
                    <div className="search-btn">Search</div>
                </div> */}
                <div className="transaction-list">
                    {transactionList && transactionList.days.map((day, index) => {
                        return <div key={index}>
                            <div className="day">{new Date(day).toDateString()}</div>
                            {transactionList.transactionList[day].map((transaction, index) => {
                                return <div key={index} className="transaction">
                                    <span>ID: {transaction.id}</span> <span>-${transaction.amount}</span>
                                </div>
                            })}
                        </div>
                    })}
                </div>
            </div>}

            {settingId === 3 && <div className="preferences">
                <div className="title">Mature Content Preference</div>
                <div>Some products and user-generated content may not be appropriate for all audiences.</div>
                <div>Tick these boxes to indicate which Store products content you see in Wibu Store:</div>
                {["General Mature Content", "Violence or Gore", "Nudity or Sexual Content"].map((tagName, index) => {
                    return <div key={index} className="mature-content-preference">
                        <input type="checkbox" id={`input-${index}`} />
                        <label htmlFor={`input-${index}`}>{tagName}</label>
                    </div>
                })}
                
                <div className="title">Platform Preferences</div>
                <div>Only show me games which support one of these operating systems:</div>
                {["Windows", "MacOS", "Linux"].map((tagName, index) => {
                    return <div key={index} className="platform-preference">
                        <input type="checkbox" id={`inpt-${index}-1`} />
                        <label htmlFor={`inpt-${index}-1`}>{tagName}</label>
                    </div>
                })}
            </div>}

            {settingId === 4 && <div className="notifications">
                <div className="title">Your Notifications</div>
                <div>Email me when:</div>
                {["Store updates", "Cart Alert", "Store Survey"].map((tagName, index) => {
                    return <div key={index} className="notification">
                        <input type="checkbox" id={`inpt-${index}-2`} />
                        <label htmlFor={`inpt-${index}-2`}>{tagName}</label>
                    </div>
                })}
            </div>}
        </div>

        {isDeleting === true && <div className="deleting">
            <div>
                <div className="title">Delete Account</div>
                <label htmlFor="verify-box">Type "Delete" in the box below to verify</label>
                <div id="verify-box">
                    <input type="text" defaultValue={verify} onChange={e => setVerify(e.target.value)} />
                </div>
                <div style={{display: "flex", marginTop: "10px"}}>
                    <div className="cancel-btn btn" onClick={() => {setIsDeleting(false)}}>Cancel</div>
                    <div className={`delete-btn btn ${verify === "Delete" ? "allow" : "not-allow"}`} onClick={async () => {const result = await requestDeleteAccount(); if (result) navigate('/');}}>Delete</div>
                </div>
                
            </div>
        </div>}
    </div>
}

export default AccountSettings;