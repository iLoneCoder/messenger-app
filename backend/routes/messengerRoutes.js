const express = require("express")
const router = express.Router()
const messengerController = require("../controllers/messengerController")
const { protect } = require("../middlewares/protect")

router.get("/get-friends", protect, messengerController.getFriends)
router.post("/send-message", protect, messengerController.messageSend)
router.get("/get-messages/:receiverId", protect, messengerController.getMessages)
router.post("/send-image", protect, messengerController.sendImage)
router.post("/update-status", protect, messengerController.updateStatus)

module.exports = router