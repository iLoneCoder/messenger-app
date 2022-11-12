import { useSelector } from "react-redux"

function Message({ messages, currentFriend, scrollRef, friendTyping }) {
    const { myInfo } = useSelector(state => state.auth)
    const { isLoading } = useSelector(state => state.messenger)
    return <div className="message-show">
        {messages.length > 0 ? messages.map(m => (
            m.senderId === myInfo.userData._id ? <div ref={scrollRef} key={m._id} className="my-message">
                <div className="image-message">
                    <div className="my-text">
                        <p className="message-text">{m.message.text ? m.message.text : <img src={`/image/${m.message.image}`} alt="" />}</p>
                    </div>
                </div>
                <div className="time">10 10 2022</div>
            </div> : <div ref={scrollRef} key={m._id} className="fd-message">
                <div className="image-message-time">
                    <div className="fd-text">
                        <img src={`/image/${currentFriend.image}`} alt="user" />
                        <div className="message-text">
                            {/* <img src="/image/39482tea-backgrounds.jpg" alt="user" /> */}
                            {m.message.text ? <p>{m.message.text}</p> :
                                <img src={`/image/${m.message.image}`} alt="" />
                            }
                        </div>

                    </div>
                    <div className="time">11 10 2022</div>
                </div>
            </div>
        )) : <>
            {!isLoading ? <div className="friend-image-name">
                <div className="image">
                    <img src={`/image/${currentFriend.image}`} alt="friend" />
                </div>

                <div className="name">
                    <h3>{currentFriend.username}</h3>
                </div>
            </div> : <></>}
        </>}

        {friendTyping.typing !== "" ? <div ref={scrollRef} className="fd-message">
            <div className="image-message-time">
                <div className="fd-text">
                    <img src={`/image/${currentFriend.image}`} alt="user" />
                    <div className="typing-message">
                        <p >typing...</p>
                    </div>

                </div>
            </div>
        </div> : <>{friendTyping.typing}</>}
        {/* <div className="my-message">
            <div className="image-message">
                <div className="my-text">
                    <p className="message-text"><img src="/image/39482tea-backgrounds.jpg" alt="user" /></p>
                </div>
            </div>
            <div className="time">10 10 2022</div>
        </div> */}





    </div >
}

export default Message