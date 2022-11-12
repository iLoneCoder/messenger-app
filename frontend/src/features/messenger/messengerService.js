import axios from "axios"


const getFriends = async () => {
    const config = {
        headers: {
            "Content-Type": "Application/json"
        }
    }
    // console.log("hh")
    const response = await axios.get("/api/messenger/get-friends", config)

    return response.data
}

const sendMessage = async (data) => {
    const config = {
        headers: {
            "Content-Type": "Application/json"
        }
    }

    const response = await axios.post("/api/messenger/send-message", data, config)

    return response.data
}

const getMessages = async (receiverData) => {
    const config = {
        headers: {
            "Content-Type": "Application/json"
        }
    }

    const { receiverId } = receiverData
    const response = await axios.get(`/api/messenger/get-messages/${receiverId}`, config)

    // console.log(response.data)

    return response.data
}

const sendImage = async (imageData) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const response = await axios.post("/api/messenger/send-image", imageData, config)

    return response.data
}

const changeToSeen = async (messageData) => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }

    const response = await axios.post("/api/messenger/update-status", messageData,config)
    
    return response.data
}

const messengerService = {
    getFriends,
    sendMessage,
    getMessages,
    sendImage,
    changeToSeen
}

export default messengerService