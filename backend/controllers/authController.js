const formidable = require("formidable")
const validator = require("validator")
const bcrypt = require("bcrypt")
const fs = require("fs")
const path = require("path")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const User = require("../models/userModel")

let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
        user: "iLoneCoder@hotmail.com",
        pass: "giorgishagidze1998"
    }
})

exports.userRegister = async (req, res) => {

    const form = formidable()

    form.parse(req, async (err, fields, files) => {
        // console.log("hh")
        try {
            // console.log(files)
            const { username, email, password, confPassword } = fields
            const { image } = files
            const errorMessages = []

            if (!username) {
                res.status(400)
                errorMessages.push("Enter username!")
            }

            if (!validator.isEmail(email)) {
                res.status(400)
                errorMessages.push("Enter email!")
            }

            if (password.length < 2) {
                res.status(400)
                errorMessages.push("Password must contain more than 2 symbols!")
            }

            if (confPassword !== password) {
                res.status(400)
                errorMessages.push("Confirm password")
            }

            if (Object.keys(files).length === 0) {
                res.status(400)
                errorMessages.push("Upload image")
            }

            if (errorMessages.length > 0) {
                res.status(400).json({ message: errorMessages })
                return
            }

            const newImageName = image.originalFilename
            const index = Math.floor(Math.random() * 99999)
            image.originalFilename = index + newImageName
            const newPath = path.join(__dirname, `../`, `../frontend/public/image/${image.originalFilename}`)

            // console.log(newPath)

            const user = await User.findOne({
                $or: [
                    { email: email },
                    { username: username }
                ]
            })

            if (user) {
                res.status(400)
                throw new Error("Choose another email or username!")
            }

            // console.log(image)
            fs.copyFile(image.filepath, newPath, async (err) => {
                if (err) {
                    throw new Error("Something wrong about image upload")
                }

                const hashedPassword = await bcrypt.hash(password, 10)

                const newUser = await User.create({
                    username,
                    email,
                    password: hashedPassword,
                    image: image.originalFilename
                })

                const id = newUser._id
                const token = generateToken(id, username, email, image.originalFilename)

                res.status(201).cookie("authToken", token, { expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000) }).json({
                    message: "Registration is done successfully",
                    userData: {
                        _id: newUser._id,
                        username,
                        email,
                        image: image.originalFilename
                    },
                    token: token
                })
            })



        } catch (error) {
            const statusCode = res.statusCode !== 200 ? res.statusCode : 500
            // const errorArr = [error.message]
            res.status(statusCode).json({ message: [error.message] })
        }

    })
}

exports.userLogin = async (req, res) => {
    const { email, password } = req.body
    //    console.log(req.body)
    try {
        if (!email || !password) {
            res.status(400)
            throw new Error("Email and password are mandatory fields")
        }

        if (!validator.isEmail(email)) {
            res.status(400)
            throw new Error("Provide email")
        }

        const user = await User.findOne({ email: email })
        if (!user) {
            res.status(400)
            throw new Error("Wrong email or password email")
        }

        const comparePassword = await bcrypt.compare(password, user.password)
        if (!comparePassword) {
            res.status(400)
            throw new Error("Wrong email or password")
        }

        const token = generateToken(user._id, user.username, email, user.image)

        res.status(201).cookie("authToken", token, { expires: new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000) }).json({
            message: "Login is done successfully",
            userData: {
                _id: user._id,
                username: user.username,
                email,
                image: user.image
            },
            token: token
        })

    } catch (error) {
        const statusCode = res.statusCode !== 200 ? res.statusCode : 500
        res.status(statusCode).json({ message: error.message })
    }
}

exports.logout = (req, res) => {
    res.status(200).cookie("authToken", "", {
        expires: new Date(Date.now())
    }).json({ success: true })
}

exports.forgotPassword = async (req, res) => {
    const { email } = req.body
    try {
        if (email === "" || !email) {
            res.status(400)
            throw new Error("Provide email")
        }

        const user = await User.findOne({ email: email })

        if (user === null) {
            res.status(404)
            throw new Error("User not found")
        }

        const token = generateTokenForPasswordReset(email)

        let mailOptions = {
            from: '"Messener app" <iLoneCoder@hotmail.com>',
            to: email,
            subject: "Messenger - Change password",
            text: "Hello world",
            html: `<h3>Read ! ! !</h3>
            <p>If this wasn't sent by you, don't click on link</p>
            <p>Contact our support team on email weDontHaveSupport@mail.com</p>
            <br>
            <a href="http://localhost:3000/messenger/change-password/${token}"  target="_blank">Click here!</a>
            `
        }

        await transporter.sendMail(mailOptions)

        res.status(200).json({ success: true })
    } catch (error) {
        const statusCode = res.statusCode !== 200 ? res.statusCode : 500

        res.status(statusCode).json({ message: error.message })
    }
}


exports.changePassword = async (req, res) => {
    const { password, confPassword } = req.body
    const { token } = req.params

    try {
        console.log("try ?")
        if (password !== "" && confPassword !== "" && token !== "") {

            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)

            const email = decodedToken.email

            if (password !== confPassword) {
                res.status(400)
                throw new Error("Password doens't match")
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            await User.findOneAndUpdate({ email: email }, { password: hashedPassword })

            res.status(201).json({ success: true })
        } else {
            res.status(400)
            throw new Error("Provide more info")
        }
    } catch (error) {
        const statusCode = res.statusCode !== 200 ? res.statusCode : 500

        res.status(statusCode).json({ message: error.message })
    }
}

function generateToken(...userData) {
    return jwt.sign({
        id: userData[0],
        username: userData[1],
        email: userData[2],
        image: userData[3]
    }, process.env.TOKEN_SECRET, {
        expiresIn: process.env.TOKEN_EXP
    })
}

function generateTokenForPasswordReset(email) {
    return jwt.sign({
        email: email
    }, process.env.TOKEN_SECRET, {
        expiresIn: '5m'
    })
}