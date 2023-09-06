const User = require("../models/user.js")
const asyncHandler = require("express-async-handler")

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email
    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        throw new Error("User Already Exists");
    }

    const newUser = await User.create(req.body)
    res.json(newUser)
})

module.exports = { createUser }