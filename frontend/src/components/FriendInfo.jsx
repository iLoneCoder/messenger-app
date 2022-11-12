import { FaCaretSquareDown } from "react-icons/fa"

function FriendInfo({ username, image, isActive }) {
    return <div className="friend-info">
        <input type="checkbox" id="images" />
        <div className="image-name">
            <div className="image">
                <img src={`/image/${image}`} alt="user" />
            </div>
            {isActive ? <div className="active-user">Active</div> : <></>}
            <div className="name">
                <h3>{username}</h3>
            </div>
        </div>

        <div className="others">
            <div className="costumise-chat">
                <h5>Costumise Chat</h5>
                <FaCaretSquareDown />
            </div>

            <div className="privacy-support">
                <h5>Privacy and support</h5>
                <FaCaretSquareDown />
            </div>

            <div className="shared-media">
                <h5>Shared media</h5>
                <label htmlFor="images"> <FaCaretSquareDown /></label>
            </div>
        </div>

        <div className="images-gallery">

            <img src="/image/39482tea-backgrounds.jpg" alt="user" />


        </div>
    </div>
}

export default FriendInfo