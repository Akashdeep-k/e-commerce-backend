const express = require("express")
const {
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
    updatePassword } = require("../controllers/user.js")

const {
    auth,
    isAdmin } = require("../middlewares/auth.js")

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.patch("/password", auth, updatePassword)
router.get("/refresh", refreshToken)
router.get("/logout", logout)

router.get("/all-users", auth, isAdmin, getAllUsers)
router.get("/:id", getUser)
router.delete("/:id", deleteUser)
router.patch("/edit", auth, updateUser)
router.patch("/block/:id", auth, isAdmin, blockUser)
router.patch("/unblock/:id", auth, isAdmin, unblockUser)

module.exports = router