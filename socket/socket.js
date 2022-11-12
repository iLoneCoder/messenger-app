const express = require("express")
const { createServer } = require("http")
const mongoose = require("mongoose")
const { Server } = require("socket.io")
const { v4: uuidv4 } = require("uuid")
const Friends = require("./models/activeFriendModel")
const Users = require("../backend/models/userModel")

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "Post"]
    }
})

let friendsList = []
const addUser = async (userId, socketId, userData) => {
    const checkUser = await Friends.findOne({ userId: userId, socketId: socketId })

    if (checkUser === null) {
        await Friends.create({ userId, socketId, userData })
    }
}

const getUsers = async () => {
    return await Friends.find()
}

const removeUser = async (socketId) => {
    return await Friends.findOneAndRemove({ socketId: socketId })
}

const findUser = async (receiverId) => {
    const friend = await Friends.find({ userId: receiverId })

    return friend
}

//after logging out delete from active users
const removeActiveUser = async myId => {
    await Friends.findOneAndRemove({userId: myId})
}


io.on("connection", (socket) => {
    socket.on("addUser", async (userId, userData) => {
        // console.log(userId)
        await addUser(userId, socket.id, userData)
        const friendsList = await getUsers()

        io.emit("getUsers", friendsList)
    })

    socket.on("sendMessage", async (messageData) => {
        const friend = await findUser(messageData.receiverId)
        // console.log(friend)
        if (friend !== null && friend !== undefined && friend.length > 0) {
            const socketMessage = {
                _id: messageData._id,
                senderId: messageData.senderId,
                receiverId: messageData.receiverId,
                message: {
                    text: messageData.message.text,
                    image: messageData.message.image
                },
                status: messageData.status
            }
            socket.to(friend[0].socketId).emit("receiveMessage", socketMessage)
        }
    })

    socket.on("sendTyping", async typingData => {
        const { receiverId } = typingData
        const friend = await findUser(receiverId)
        // console.log(friend.length)
        if (friend !== null && friend !== undefined && friend.length > 0) {
            // console.log(friend)

            socket.to(friend[0]?.socketId).emit("receiveTyping", typingData)

        }
    })

    socket.on("iHaveSeenMessage", async (lastMessage) => {
        const friend = await findUser(lastMessage.senderId)
        if (friend !== null && friend !== undefined && friend.length > 0) {
            console.log(lastMessage)
            socket.to(friend[0]?.socketId).emit("friendHasSeenMessage", lastMessage)
        }
    })

    //when user logs out remove it from active users
    socket.on("delete-active-user", async myId => {
        await removeActiveUser(myId)
        const friendsList = await getUsers()
        
        io.emit("getUsers", friendsList)
    })

    //new user registered so we have to refresh friend list
    socket.on("new-user-registered", () => {
        io.emit("restart-friend-list")
    })

    //when user disconnects we delete it from active users
    socket.on("disconnect", async () => {
        console.log("disconected: ", socket.id)
        await removeUser(socket.id)
        const friendsList = await getUsers()
        // console.log(friendsList)
        io.emit("getUsers", friendsList)
    })
})

mongoose.connect("mongodb+srv://Node:BFrfGKWiG1IocauG@cluster0.ldu39.mongodb.net/messenger", () => {
    httpServer.listen(8000)
})