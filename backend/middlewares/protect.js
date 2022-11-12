const jwt = require("jsonwebtoken")

exports.protect = async (req, res, next) => {

    try {
        if (!req.headers.cookie) {
            res.status(401)
            throw new Error("something wrong, log in again!")
        }
        const str = req.headers.cookie.split("; ").find(el => el.startsWith("authToken"))
        let token
        if (str) {
            token = str.split("=")[1]
        } else {
            token = ""
        }
        // const token = req.headers.cookie.split("=")[1]
        // console.log("cookie exists: " + token)
        if (token !== "") {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
            req.user = decodedToken.id

            // console.log(req.user)

        } else {
            res.status(401)
            throw new Error("token is undefined!")
        }
        next()
    } catch (error) {
        const statusCode = res.statusCode !== 200 ? res.statusCode : 500

        res.status(statusCode).json({ message: error.message, message1: "hh" })
    }
}