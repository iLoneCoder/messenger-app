const User = require("../models/userModel")
const Message = require("../models/messageModel")
const formidable = require("formidable")
const path = require("path")
const fs = require("fs")

const getLastMessageOfFriends = async (friend, myId) => {
    const lastMessage = await Message.findOne({
        $or: [
            {
                $and: [
                    {
                        senderId: myId,
                        receiverId: friend._id
                    }
                ]
            },
            {
                $and: [
                    {
                        senderId: friend._id,
                        receiverId: myId
                    }
                ]
            }
        ]
    }).sort({ createdAt: -1 })

    return {
        friendInfo: friend,
        lastMessage
    }
}

exports.getFriends = async (req, res) => {

    const myId = req.user

    try {
        const friends = await User.find({ _id: { $ne: myId } }).select("-password")
        let friendsWithLastMessage = []
        // const filterFriends = friends.filter(el => el._id.toString() !== req.user.toString())
        for (let friend of friends) {
            const friendAndLastMessage = await getLastMessageOfFriends(friend, myId)
            friendsWithLastMessage = [...friendsWithLastMessage, friendAndLastMessage]
        }
        // console.log(friendsWithLastMessage[0])
        res.status(200).json({ success: true, friends: friendsWithLastMessage })
    } catch (error) {
        const statusCode = res.statusCode !== 200 ? res.statusCode : 500
        res.status(statusCode).json({ message: error })
    }
}

exports.messageSend = async (req, res) => {
    const senderId = req.user
    const { receiverId, message } = req.body

    try {
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message: {
                text: message.text
            },
            status: "delivered"
        }
        )

        res.status(201).json({ success: true, message: newMessage })
    } catch (error) {
        const statusCode = res.statusCode !== 200 ? res.statusCode : 500

        res.status(statusCode).json({ message: error.message })
    }


}

exports.getMessages = async (req, res) => {
    const senderId = req.user
    const { receiverId } = req.params
    // console.log(senderId, receiverId)
    try {

        const messages = await Message.find({
            $or: [
                {
                    $and: [{
                        senderId: senderId,
                        receiverId: receiverId
                    }]
                }, // and operator body finishes
                {
                    $and: [{
                        senderId: receiverId,
                        receiverId: senderId
                    }]
                } // and operator budy finishes
            ]   // or operator body finishes
        })

        res.status(200).json(messages)

    } catch (error) {
        const statusCode = res.statusCode !== 200 ? res.statusCode : 500

        res.status(statusCode).json({ message: error.message })
    }

}

exports.sendImage = async (req, res) => {
    const form = formidable()
    const senderId = req.user

    form.parse(req, async (err, fields, files) => {
        try {
            if (err) {
                res.json(500)
                throw new Error("Something wrong try again")
            }

            const { receiverId, imageName } = fields
            const { image } = files

            image.originalFilename = imageName
            const newPath = path.join(__dirname, "../", `../frontend/public/image/${image.originalFilename}`)

            fs.copyFile(image.filepath, newPath, async (err) => {
                if (err) {
                    throw new Error("Something wrong about file sending")
                }

                const newMessage = await Message.create({
                    senderId,
                    receiverId,
                    message: {
                        text: "",
                        image: image.originalFilename
                    },
                    status: "delivered"
                })

                res.status(201).json({
                    success: true,
                    message: newMessage
                })
            })

        } catch (error) {
            const statusCode = res.statusCode !== 200 ? res.statusCode : 500

            res.status(statusCode).json({ message: error.message })
        }
    })
}

exports.updateStatus = async (req, res, next) => {
    const { messageId } = req.body

    try {
        if (messageId) {
            const lastMessage = await Message.findByIdAndUpdate(messageId, { status: "seen" }, { new: true })
            
            res.status(200).json({ success: true, message: lastMessage })
        } else {
            res.status(400)
            throw new Error("Message isn't send, try again")
        }
    } catch (error) {
        const statusCode = res.Statuscode !== 200 ? res.statusCode : 500

        res.status(statusCode).json({ message: error.message })
    }
}