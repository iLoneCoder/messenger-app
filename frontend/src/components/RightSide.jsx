import { FaPhoneAlt, FaRocketchat, FaVideo } from "react-icons/fa"
import Message from "./Message"
import MessageSend from "./MessageSend"
import FriendInfo from "./FriendInfo"

function RightSide({ username, image, newMessage, handleNewMessage, handleSendMessage, messages, currentFriend, scrollRef, handleEmoji,
    handleImage, isActive, friendTyping, handleSeen
}) {
    return <div className="col-9">
        <div className="right-side">
            <div className="row">
                <input type="checkbox" id="dot" />
                <div className="col-8">
                    <div className="message-send-show">
                        <div className="header">
                            <div className="image-name">
                                <div className="image">
                                    <img src={`/image/${image}`} alt="user" />
                                    {isActive ? <div className="active-user"></div> : <></>}
                                </div>
                                <div className="name">
                                    <h4>{username}</h4>
                                </div>
                            </div>
                            <div className="icons">
                                <label htmlFor=""><div className="icon"><FaPhoneAlt /></div></label>
                                <label htmlFor=""><div className="icon"><FaVideo /></div></label>
                                <label htmlFor="dot"><div className="icon"><FaRocketchat /></div></label>
                            </div>
                        </div>
                        <Message messages={messages} currentFriend={currentFriend} scrollRef={scrollRef} friendTyping={friendTyping}/>
                        <MessageSend newMessage={newMessage} handleNewMessage={handleNewMessage} handleSendMessage={handleSendMessage} handleEmoji={handleEmoji}
                            handleImage={handleImage} handleSeen={handleSeen} />
                    </div>
                </div>
                <div className="col-4">
                    <FriendInfo username={username} image={image} isActive={isActive} />
                </div>
            </div>
        </div>
    </div>
}

export default RightSide