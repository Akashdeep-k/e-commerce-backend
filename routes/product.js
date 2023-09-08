const express = require("express")
const router = express.Router()

const {
    createProduct,
    getAProduct,
    getAllProducts,
    updateAProduct,
    deleteAProduct
} = require("../controllers/product.js")

const {
    authMiddleware,
    isAdmin
} = require("../middlewares/authMiddleware.js")


router.post("/", authMiddleware, isAdmin, createProduct)
router.get("/:id", getAProduct)
router.get("/", getAllProducts)
router.patch("/:id", authMiddleware, isAdmin, updateAProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteAProduct)

module.exports = router