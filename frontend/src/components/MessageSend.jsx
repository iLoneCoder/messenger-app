import { FaPlusCircle, FaImage, FaGift, FaTelegramPlane, FaHeart } from "react-icons/fa"

function MessageSend({ newMessage, handleNewMessage, handleSendMessage, handleEmoji, handleImage, handleSeen }) {


    const emojis = [
        '😀', '😃', '😄', '😁',
        '😆', '😅', '😂', '🤣',
        '😊', '😇', '🙂', '🙃',
        '😉', '😌', '😍', '😝',
        '😜', '🧐', '🤓', '😎',
        '😕', '🤑', '🥴', '😱'
    ]

    return <div className="message-send-section">
        <input type="checkbox" id="emoji" />
        <div className="file hover-attachment">
            <div className="add-attachment">
                Add attachment
            </div>
            <label><FaPlusCircle /></label>
        </div>

        <div className="file hover-image">
            <div className="add-image">
                Add image
            </div>
            <label htmlFor="pic"><FaImage /></label>
            <input type="file" id="pic"  onChange={handleImage}/>
            {/* <FaImage /> */}
        </div>

        <div className="file hover-gift">
            <div className="add-gift">
                Add gift
            </div>
            <label><FaGift /></label>
        </div>

        <div className="message-type">
            <input type="text" className="form-control" name="message" id="message" placeholder="Aa" value={newMessage} onChange={handleNewMessage} onClick={handleSeen}/>
            <div className="file hover-gift">
                <div className="add-gift">
                    Add emoji
                </div>
                <label htmlFor="emoji"><FaTelegramPlane /></label>
            </div>
        </div>

        <div className="file" onClick={handleSendMessage}>
            <FaHeart />
        </div>

        <div className="emoji-section">
            <div className="emoji">
                {emojis.map((e, i) => <span key={i} onClick={() => handleEmoji(e)}>{e}</span>)}
            </div>
        </div>
    </div>
}

export default MessageSend