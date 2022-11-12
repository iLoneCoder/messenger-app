const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const authRoutes = require("./routes/authRoutes")
const messengerRouter = require("./routes/messengerRoutes")
const PORT = process.env.PORT



app.use("/api/messenger", authRoutes)
app.use("/api/messenger", messengerRouter)

mongoose.connect("mongodb+srv://Node:BFrfGKWiG1IocauG@cluster0.ldu39.mongodb.net/messenger")
    .then(() => {
        app.listen(PORT, () => console.log(`server is listening to port ${PORT}`))
    })