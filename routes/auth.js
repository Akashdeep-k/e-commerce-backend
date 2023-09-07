const express = require("express")
const {
    createUser,
    loginUser,
    getAllUsers,
    getAUser,
    deleteAUser,
    updateAUser } = require("../controllers/user.js")

const {
    authMiddleware,
    isAdmin } = require("../middlewares/authMiddleware.js")

const router = express.Router()

router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/all-users", authMiddleware, isAdmin, getAllUsers)
router.get("/:id", getAUser)
router.delete("/:id", deleteAUser)
router.patch("/edit-user", authMiddleware, updateAUser)

module.exports = router