const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")

router.post("/user-register", authController.userRegister)
router.post("/user-login", authController.userLogin)
router.post("/user-logout", authController.logout)
module.exports = router