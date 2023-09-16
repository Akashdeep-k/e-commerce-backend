const jwt = require("jsonwebtoken")
const asyncHandler = require("express-async-handler")
const User = require("../models/user.js")

const auth = asyncHandler(async (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded_token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ _id: decoded_token.id })

    if (!user) {
        throw new Error("Please authenticate");
    }

    req.user = user;
    next();
})

const isAdmin = asyncHandler(async (req, res, next) => {
    if(req.user.role !== 'admin'){
        throw new Error("You are not admin")
    }
    next();
})

module.exports = { auth, isAdmin }