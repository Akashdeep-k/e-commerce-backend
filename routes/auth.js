const express = require("express")
const { createUser,
        loginUser,
        getAllUsers } = require("../controllers/user.js")

const router = express.Router()

router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/all-users", getAllUsers)

module.exports = router