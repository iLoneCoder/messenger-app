const mongoose = require("mongoose")
const Users = require("../../backend/models/userModel")
const Schema = mongoose.Schema
const activeFriendSchema = new Schema({
    userId: {
        type: String,
        default: ""
    },

    socketId: {
        type: String,
        default: ""
    },

    userData: {
        type: Object
    }
}, { timestamps: true })

module.exports = mongoose.model("active-friend", activeFriendSchema)