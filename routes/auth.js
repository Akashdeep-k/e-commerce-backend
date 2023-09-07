const express = require("express")
const { createUser,
    loginUser,
    getAllUsers,
    getAUser,
    deleteAUser,
    updateAUser } = require("../controllers/user.js")

const router = express.Router()

router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/all-users", getAllUsers)
router.get("/:id", getAUser)
router.delete("/:id", deleteAUser)
router.patch("/:id", updateAUser)

module.exports = router