const User = require("../models/user.js")
const asyncHandler = require("express-async-handler")
const getAccessToken = require("../config/accessToken.js")
const isValidMongoDbId = require("../utils/validateMongoDbId.js")
const getRefreshToken = require("../config/refreshToken.js")
const jwt = require("jsonwebtoken")

const signup = asyncHandler(async (req, res) => {
    const email = req.body.email
    const userExist = await User.findOne({ email })

    if (userExist) {
        res.status(400)
        throw new Error("User Already Exists");
    }

    const newUser = await User.create(req.body)
    res.json(newUser)
})

const login = asyncHandler(async (req, res) => {
    console.log("Hi3")
    const { email, password } = req.body
    console.log("Hi4")
    const user = await User.findOne({ email })
    console.log("Hi5")
    console.log(email, password)
    console.log(user)
    if (user && await user.isPasswordMatch(password)) {
        console.log("Hi6")
        const refreshToken = getRefreshToken(user._id)
        console.log("Hi7")
        await User.findByIdAndUpdate(user._id, {
            refreshToken
        })
        console.log("Hi8")
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000 //3 days
        })
        console.log("Hi9")

        const accessToken = getAccessToken(user._id)
        res.json({ user, accessToken })
        console.log("Hi10")

    }
    else {
        res.status(400)
        throw new Error("Invalid Credentials")
    }
})

const refreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie.refreshToken) {
        throw new Error("No refresh token in cookies")
    }

    const refreshToken = cookie.refreshToken
    const user = await User.findOne({ refreshToken })

    if (!user) {
        throw new Error("No refresh token present in db or not matched")
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    if (user._id.toString() !== decoded.id) {
        console.log(user._id, decoded.id)
        throw new Error("There is something wrong with refresh token")
    }

    const accessToken = await getAccessToken(user._id)
    res.json(accessToken)
})

const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie.refreshToken) {
        throw new Error("No refresh token in cookies")
    }

    const refreshToken = cookie.refreshToken
    const user = await User.findOne({ refreshToken })

    if (user) {
        await User.findOneAndUpdate({ refreshToken }, {
            refreshToken: "",
        });
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204);
})

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (e) {
        throw new Error(e)
    }
})

const getUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        isValidMongoDbId(id)
        const user = await User.findById(id)
        res.json(user)
    } catch (e) {
        throw new Error(e)
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        isValidMongoDbId(id)
        const user = await User.findByIdAndDelete(id)
        res.json(user)
    } catch (e) {
        throw new Error(e)
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const updates = Object.keys(req.body)
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

const blockUser = asyncHandler(async (req, res) => {
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

const unblockUser = asyncHandler(async (req, res) => {
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

const updatePassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    if (password) {
        req.user.password = password;
        await req.user.save();
        res.json(req.user);
    } else {
        res.json(req.user);
    }
});

module.exports = {
    signup,
    login,
    refreshToken,
    logout,
    getAllUsers,
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    updatePassword
}