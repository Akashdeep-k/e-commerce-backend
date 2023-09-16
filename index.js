const express = require("express")
const app = express()
require("dotenv").config()
const dbConnect = require("./config/db/connect.js")
const { notFound, errorHandler } = require("./middlewares/errorHandler.js")
const authRouter = require("./routes/auth.js")
const productRouter = require("./routes/product.js")
const blogRouter = require("./routes/blog.js")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")

dbConnect()
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())
app.use("/api/user", authRouter)
app.use("/api/product", productRouter)
app.use("/api/blog", blogRouter)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`)
})