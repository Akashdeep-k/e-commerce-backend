const User = require("../models/user.js")
const asyncHandler = require("express-async-handler")
const getAuthToken = require("../config/jwtToken.js")

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

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (user && await user.isPasswordMatch(password)) {
        const token = getAuthToken(user._id)
        res.json({ user, token })
    }
    else {
        res.status(400)
        throw new Error("Invalid Credentials")
    }
})

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (e) {
        throw new Error(e)
    }
})

const getAUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)
        res.json(user)
    } catch (e) {
        throw new Error(e)
    }
})

module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getAUser
}