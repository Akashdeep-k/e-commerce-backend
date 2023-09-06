const express = require("express")
const { createUser } = require("../controllers/user.js")

const router = express.Router()

router.post("/register", createUser)

module.exports = router