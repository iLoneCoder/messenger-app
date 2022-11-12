import { FaCheckCircle } from "react-icons/fa"

function Friend({ friend, myId, currentFriend, activeFriends }) {
    // useEffect(() => {
    //     if (friend.lastMessage) {
    //         console.log(myId)
    //         console.log(friend.lastMessage.senderId)
    //     }
    // }, [])
    return <div className="friend">
        <div className="image-friend-name">
            <div className="image">
                <img src={`/image/${friend.friendInfo.image}`} alt="user" />
                {activeFriends.some(fd => fd.userData._id === friend.friendInfo._id)? <div className="active-icon"></div> : <></>}
            </div>
            <div className="friend-name">
                <h4>{friend.friendInfo.username}</h4>

                <div className="last-message">
                    {friend.lastMessage !== null ? <>

                        <span>{myId === friend.lastMessage.senderId ? "You: " : `${friend.friendInfo.username}: `}</span>

                        <span>{friend.lastMessage.message.text !== "" ? `${friend.lastMessage.message.text.slice(0, 15)}` : "In chat box is image"}</span>
                    </> :

                        <></>}

                </div>
            </div>


        </div>
        {friend.lastMessage !== null ? <div className="seen-not-seen">

            {myId === friend.lastMessage.senderId && friend.lastMessage.status === "delivered" ? <div className="delivered"><FaCheckCircle id="deliver-sign" /></div>
                : myId === friend.lastMessage.senderId && friend.lastMessage.status === "seen" ? <div className="seen">
                    <img src={`/image/${friend.friendInfo.image}`} alt="friend" />
                </div> : myId !== friend.lastMessage.senderId && friend.lastMessage.status === "delivered" && friend.friendInfo._id !== currentFriend._id ? <div className="not-seen"></div> : <></>}

        </div>

            : <></>}
    </div>
}

export default Friend