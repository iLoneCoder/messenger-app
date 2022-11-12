const mongoose = require("mongoose")
const Schema = mongoose.Schema

const messageSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    message: {
        text: {
            type: String,
            default: ""
        },
        image: {
            type: String,
            default: ""
        }
    },
    status: {
        type: String,
        default: "not seen"
    }
}, { timestamps: true })

module.exports = mongoose.model("message", messageSchema)