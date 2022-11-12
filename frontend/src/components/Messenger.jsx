import { useEffect, useState, useRef } from "react"
import { FaEllipsisH, FaEdit, FaSistrix } from "react-icons/fa"
import { useSelector, useDispatch } from "react-redux"
// import {useNavigate} from "react-router-dom"
import { io } from "socket.io-client"
import { toast } from "react-toastify"
import useSound from "use-sound"
import notificationSound from "../audio/notification.mp3"
import sendingSound from "../audio/sending.mp3"
// import ActiveFriend from "./ActiveFriend"
import Friend from "./Friend"
import RightSide from "./RightSide"
import {
    getFriends, sendMessage, getMessages, sendImage, receiveSocketMessage, setInitialValueForMessageIsSaved,
    updateMyLastMessage, updateFriendsLastMessage, messageStatusToSeen, friendHasSeenMessage
} from "../features/messenger/messengerSlice"
import EditDropDown from "./EditDropDown"

function Messenger() {

    const [playNotification] = useSound(notificationSound)
    const [playSending] = useSound(sendingSound)

    const friendsEffect = useRef(false)
    const scrollRef = useRef()
    const socketRef = useRef()
    const addUsersRef = useRef(false)
    const receiveMessageOnceRef = useRef(false)
    const currentFriendRef = useRef(false)

    const { friends, messages, messageIsSaved, messageIsSeen } = useSelector(state => state.messenger)
    const { myInfo } = useSelector(state => state.auth)
    // const [username, setUsername] = useState("")
    // const [image, setImage] = useState("")
    // const [myId, setMyId] = useState("")
 const  { username, image, _id: myId } = myInfo.userData


    const [currentFriend, setCurrnetFriend] = useState("")
    const [newMessage, setNewMessage] = useState("")
    const [activeFriends, setActiveFriends] = useState([])
    const [isActive, setIsActive] = useState(false)
    const [typing, setTyping] = useState({ typing: "" })
    const [imageNameState, setImageNameState] = useState("")
    const [lastMessageState, setLastMessageState] = useState("")
    const [hideEditDropDown, setEditDropDown] = useState(true)

    const dispatch = useDispatch()
    // const navigate = useNavigate()

    const handleNewMessage = (e) => {
        setNewMessage(e.target.value)

        // setTyping(e.target.value)
        //socketing typing motion. sending to backend
        const typingData = {
            senderId: myInfo.userData._id,
            receiverId: currentFriend._id,
            typing: e.target.value
        }

        socketRef.current.emit("sendTyping", typingData)
    }

    const handleEmoji = (e) => {
        setNewMessage(newMessage + e)
    }

    //put message in db and send socket message
    const handleSendMessage = () => {
        if (newMessage) {
            const messageData = {
                receiverId: currentFriend._id,
                message: {
                    text: newMessage,
                    image: ""
                }
            }

            dispatch(sendMessage(messageData))
            // setNewMessage("")
            // messageData.senderId = myInfo.userData._id
            // socketRef.current.emit("sendMessage", messageData)
            playSending()
        }
    }

    const handleImage = (e) => {
        if (e.target.files.length > 0) {
            let image = e.target.files[0]
            let imageName = Date.now().toString() + image.name
            const formData = new FormData()

            formData.append("receiverId", currentFriend._id)
            formData.append("imageName", imageName)
            formData.append("image", image)
            setImageNameState(imageName)
            dispatch(sendImage(formData))
            playSending()
            // const messageData = {
            //     senderId: myInfo.userData._id,
            //     receiverId: currentFriend._id,
            //     message: {
            //         text: "",
            //         image: imageName
            //     }
            // }

            // socketRef.current.emit("sendMessage", messageData)
        }

    }

    const handleSeen = () => {
        const friend = friends.find(fd => fd.friendInfo._id === currentFriendRef.current._id)
        const { lastMessage } = friend
        if (lastMessage !== null && lastMessage.status !== "seen" && lastMessage.senderId !== myId) {
            dispatch(messageStatusToSeen({ messageId: lastMessage._id }))
            setLastMessageState(lastMessage)
        }
    }

    const chooseCurrentFriend = (friend, firstTry = false) => {


        setCurrnetFriend(friend.friendInfo)
        currentFriendRef.current = friend.friendInfo
        setTyping({ typing: "" })

        if (!firstTry) {
            const myFriend = friends.find(fd => fd.friendInfo._id === currentFriendRef.current._id)
            const { lastMessage } = myFriend
            if (lastMessage !== null && lastMessage.status !== "seen" && lastMessage.senderId !== myId) {
                // console.log("hh")
                dispatch(messageStatusToSeen({ messageId: lastMessage._id }))
                setLastMessageState(lastMessage)
            }
        }
    }

    const handleClickEdit = () => {
        setEditDropDown(!hideEditDropDown)
        // console.log("Clicked")
    }

    // useEffect(() => {
    //     if (myInfo === null) {
    //         navigate("/messenger/login")
    //         // setUsername(myInfo.userData.username)
    //         // setImage(myInfo.userData.image)
    //         // setMyId(myInfo.userData._id)
    //         // const  { username, image, _id: myId } = myInfo.userData
    //     }
    // }, [myInfo, navigate])

    useEffect(() => {
        console.log(friendsEffect.current)
        if (friendsEffect.current === false) {
            dispatch(getFriends())

            return () => {
                friendsEffect.current = true
            }
        }
    }, [dispatch])

    useEffect(() => {
        if (friends.length > 0 && !currentFriendRef.current) {
            setCurrnetFriend(friends[0].friendInfo, true)
            currentFriendRef.current = friends[0].friendInfo
            if (activeFriends.length > 0) {
                currentFriendRef.current = friends[0].friendInfo
                const active = activeFriends.some(u => u.userId === currentFriend._id)
                // console.log(active)
                setIsActive(active)
            }
        }
        // eslint-disable-next-line 
    }, [friends])

    useEffect(() => {
        if (currentFriend) {

            const receiverData = {
                receiverId: currentFriend._id
            }

            dispatch(getMessages(receiverData))
        }
    }, [currentFriend, dispatch])


    useEffect(() => {

        if (typing.typing !== "") {
            scrollRef.current?.scrollIntoView({ behavior: "auto" })

        } else {
            scrollRef.current?.scrollIntoView({ behavior: "auto" })
        }
    }, [messages, typing])


    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io("http://localhost:8000")
        }
    }, [])


    //add active user
    useEffect(() => {
        if (!addUsersRef.current) {
            socketRef.current.emit("addUser", myInfo.userData._id, myInfo.userData)
            // console.log("adding user")
            return () => {
                addUsersRef.current = true
            }
        }
    }, [myInfo.userData])


    //get active friends
    useEffect(() => {
        socketRef.current.on("getUsers", activeFriendsList => {
            const friends = activeFriendsList.filter(fd => fd.userId !== myInfo.userData._id)
            // console.log(activeFriendsList)
            setActiveFriends(friends)
        })
        // console.log(myInfo.userData)
        return () => {
            socketRef.current.off("getUsers")

        }
    }, [myInfo.userData])

    useEffect(() => {
        if (activeFriends.length > 0) {
            const active = activeFriends.some(u => u.userId === currentFriend._id)
            // console.log(active)
            setIsActive(active)
        }
    }, [currentFriend._id, activeFriends])


    //send message with socket after it is saved in db successfully
    useEffect(() => {

        if (messageIsSaved) {
            const messageData = {
                _id: messages[messages.length - 1]._id,
                senderId: myId,
                receiverId: currentFriend._id,
                message: {
                    text: newMessage,
                    image: ""
                },
                status: messages[messages.length - 1].status
            }

            if (newMessage) {
                socketRef.current.emit("sendMessage", messageData)
                //message is saved and send. Now we need to restart value of messageIsSaved
                // socketRef.current.emit("updateLastMessage", messageData)
                dispatch(setInitialValueForMessageIsSaved())
                dispatch(updateMyLastMessage(messageData))
            }
            setNewMessage("")
        }

        // return () => {
        //     messageIsSaved = false
        // }
    }, [messageIsSaved, currentFriend, myId, newMessage, messages, dispatch])

    //send image with socket after it is saved in db
    useEffect(() => {

        if (messageIsSaved && imageNameState) {

            const imageData = {
                _id: messages[messages.length - 1]._id,
                senderId: myId,
                receiverId: currentFriend._id,
                message: {
                    text: "",
                    image: imageNameState
                },
                status: messages[messages.length - 1].status
            }

            socketRef.current.emit("sendMessage", imageData)
            setImageNameState("")
            dispatch(setInitialValueForMessageIsSaved())
            dispatch(updateMyLastMessage(imageData))
        }
    }, [currentFriend, imageNameState, messageIsSaved, myId, messages, dispatch])

    //receive message
    useEffect(() => {

        // if (!receiveMessageOnceRef.current) {

        socketRef.current.on("receiveMessage", (messageData) => {
            receiveMessageOnceRef.current = true
            // console.log("messageData")
            // console.log(currentFriend)
            if (messageData.senderId === currentFriend._id) {
                dispatch(receiveSocketMessage(messageData))
                //auto seen when you have open friend chat
                if (messageData.senderId !== myId && messageData.status !== "seen") {
                    dispatch(messageStatusToSeen({ messageId: messageData._id }))
                    setLastMessageState(messageData)
                }
            }
            setTyping({ typing: "" })

            //get message notification
            if (messageData.senderId !== currentFriend._id) {
                toast.success("You have new notification")
                playNotification()
            }

            dispatch(updateFriendsLastMessage(messageData))
        })

        return () => {
            socketRef.current.off("receiveMessage")
        }
        // }    
    }, [dispatch, playNotification, currentFriend, myId])

    //get typing message for receiver
    useEffect(() => {
        // console.log(currentFriend)
        // if (!typingRef.current) {
        socketRef.current.on("receiveTyping", typingData => {
            // console.log(typingData?.senderId)
            // console.log(currentFriendRef.current)
            if (typingData?.senderId === currentFriendRef.current._id) {
                setTyping(typingData)
            }
        })

        return () => {
            // typingRef.current = true
            socketRef.current.off("receiveData")
        }
        // }

    }, [currentFriend])

    //let friend know that you have seen the message
    useEffect(() => {
        if (messageIsSeen && currentFriendRef.current._id === lastMessageState.senderId) {
            const lastMessage = { ...lastMessageState }
            lastMessage.status = "seen"
            socketRef.current.emit("iHaveSeenMessage", lastMessage)
        }
    }, [messageIsSeen, lastMessageState])

    //to get notified, when friend sees message
    useEffect(() => {
        socketRef.current.on("friendHasSeenMessage", (lastMessage) => {
            // console.log(lastMessage)
            dispatch(friendHasSeenMessage(lastMessage.receiverId))
        })
    }, [dispatch])

    //new user registered so we are getting friends list again
    useEffect(() => {
        socketRef.current.on("restart-friend-list", () => {    
            dispatch(getFriends())
        })
    }, [dispatch])

    if(myInfo === null) {
        return
    }

    return <div className="messenger">
        <div className="row">
            <div className="col-3">
                <div className="left-side">
                    <div className="top">
                        <div className="image-name">
                            <div className="image">
                                <img src={`/image/${image}`} alt="user" />
                            </div>
                            <div className="name">
                                <h3>{username}</h3>
                            </div>
                        </div>
                        <div className="icons-dropdown">
                            <div className="icons">
                                <div className="icon" onClick={handleClickEdit}><FaEllipsisH /></div>
                                <div className="icon"><FaEdit /></div>

                            </div>
                            {!hideEditDropDown ? <EditDropDown socket = {socketRef.current} myId = {myId}/> : <></>}
                        </div>
                    </div>

                    <div className="friend-search">
                        <div className="search">
                            <button><FaSistrix /></button>
                            <input type="text" className="form-control" placeholder="Search" />
                        </div>
                    </div>

                    {/* <div className="active-friends">
                        <div className="active-friend">
                            <div className="image-active-icon">
                                {activeFriends.length > 0 && activeFriends.map(friend => (
                                    <div key={friend.userId} onClick={() => chooseCurrentFriend(friend.userData)}>
                                        <ActiveFriend friend={friend} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div> */}

                    <div className="friends">
                        {friends.length > 0 && friends.map((friend) => (
                            <div key={friend.friendInfo._id} className={friend.friendInfo._id === currentFriend._id ? "hover-friend active" : "hover-friend"} onClick={() => chooseCurrentFriend(friend)}>
                                <Friend friend={friend} myId={myId} currentFriend={currentFriendRef.current} activeFriends={activeFriends} />
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            {(currentFriend.username && currentFriend.image) ? <RightSide username={currentFriend.username}
                image={currentFriend.image}
                newMessage={newMessage}
                handleNewMessage={handleNewMessage}
                handleSendMessage={handleSendMessage}
                messages={messages}
                currentFriend={currentFriend}
                scrollRef={scrollRef}
                handleEmoji={handleEmoji}
                handleImage={handleImage}
                isActive={isActive}
                friendTyping={typing}
                handleSeen={handleSeen}
            /> : <></>}


        </div>

    </div>
}

export default Messenger