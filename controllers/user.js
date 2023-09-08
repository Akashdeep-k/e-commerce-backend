const User = require("../models/user.js")
const asyncHandler = require("express-async-handler")
const getAuthToken = require("../config/jwtToken.js")
const isValidMongoDbId = require("../utils/validateMongoDbId.js")
const getRefreshAuthToken = require("../config/refreshToken.js")
const jwt = require("jsonwebtoken")

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
        const refreshToken = getRefreshAuthToken(user._id)
        const updateUser = await User.findByIdAndUpdate(user._id, {
            refreshToken
        }, {
            new: true
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })

        const token = getAuthToken(user._id)
        res.json({ user, token })
    }
    else {
        res.status(400)
        throw new Error("Invalid Credentials")
    }
})

const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie.refreshToken) {
        throw new Error("No refresh token in cookies")
    }

    const refreshToken = cookie.refreshToken
    const user = await User.findOne({ refreshToken })

    if (!user) {
        throw new Error("No refresh token present in db or not matched")
    }
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET)
    if(user._id.toString() !== decoded.id){
        console.log(user._id, decoded.id)
        throw new Error("There is something wrong with refresh token")
    }

    const accessToken = await getAuthToken(user._id)
    res.json(accessToken)
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
        isValidMongoDbId(id)
        const user = await User.findById(id)
        res.json(user)
    } catch (e) {
        throw new Error(e)
    }
})

const deleteAUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        isValidMongoDbId(id)
        const user = await User.findByIdAndDelete(id)
        res.json(user)
    } catch (e) {
        throw new Error(e)
    }
})

const updateAUser = asyncHandler(async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedupdates = ["firstName", "lastName", "email", "mobile", "password", "role"]

    const validUpdates = updates.every(update => allowedupdates.includes(update))

    if (!validUpdates) {
        res.status(400)
        throw new Error("Invalid updates")
    }

    try {
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()

        res.json(req.user)
    } catch (e) {
        throw new Error(e)
    }
})

const blockAUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    isValidMongoDbId(id)
    try {
        const user = await User.findByIdAndUpdate(id, {
            isBlocked: true
        }, {
            new: true
        })

        res.json("User blocked")
    } catch (e) {
        throw new Error(e)
    }
})

const unblockAUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    isValidMongoDbId(id)
    try {
        const user = await User.findByIdAndUpdate(id, {
            isBlocked: false
        }, {
            new: true
        })

        res.json("User unblocked")
    } catch (e) {
        throw new Error(e)
    }
})

module.exports = {
    createUser,
    loginUser,
    handleRefreshToken,
    getAllUsers,
    getAUser,
    deleteAUser,
    updateAUser,
    blockAUser,
    unblockAUser
}