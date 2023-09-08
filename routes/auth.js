const express = require("express")
const {
    createUser,
    loginUser,
    handleRefreshToken,
    getAllUsers,
    getAUser,
    deleteAUser,
    updateAUser,
    blockAUser,
    unblockAUser } = require("../controllers/user.js")

const {
    authMiddleware,
    isAdmin } = require("../middlewares/authMiddleware.js")

const router = express.Router()

router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/refresh", handleRefreshToken)
router.get("/all-users", authMiddleware, isAdmin, getAllUsers)
router.get("/:id", getAUser)
router.delete("/:id", deleteAUser)
router.patch("/edit-user", authMiddleware, updateAUser)
router.patch("/block-user/:id", authMiddleware, isAdmin, blockAUser)
router.patch("/unblock-user/:id", authMiddleware, isAdmin, unblockAUser)

module.exports = router