const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")

router.post("/user-register", authController.userRegister)
router.post("/user-login", authController.userLogin)
router.post("/user-logout", authController.logout)
router.post("/forgot-password", authController.forgotPassword)
router.post("/change-password/:token", authController.changePassword)
module.exports = router