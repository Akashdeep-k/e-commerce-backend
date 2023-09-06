const express = require("express")
const app = express()
require("dotenv").config()
const dbConnect = require("./config/db/connect.js")
const { notFound, errorHandler } = require("./middlewares/errorHandler.js")
const authRouter = require("./routes/auth.js")

dbConnect()
app.use(express.json())
app.use("/api/user", authRouter)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`)
})