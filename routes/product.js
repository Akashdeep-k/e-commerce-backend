const express = require("express")
const router = express.Router()

const {
    createProduct,
    getProduct,
    getAllProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/product.js")

const {
    auth,
    isAdmin
} = require("../middlewares/auth.js")


router.post("/", auth, isAdmin, createProduct)
router.get("/:id", getProduct)
router.get("/", getAllProducts)
router.patch("/:id", auth, isAdmin, updateProduct)
router.delete("/:id", auth, isAdmin, deleteProduct)

module.exports = router