const express = require("express")
const app = express()
require("dotenv").config()
const dbConnect = require("./config/db/connect.js")
const { notFound, errorHandler } = require("./middlewares/errorHandler.js")
const authRouter = require("./routes/auth.js")
const productRouter = require("./routes/product.js")
const cookieParser = require("cookie-parser")

dbConnect()
app.use(express.json())
app.use(cookieParser())
app.use("/api/user", authRouter)
app.use("/api/product", productRouter)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`)
})