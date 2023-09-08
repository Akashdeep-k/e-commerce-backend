const express = require("express")
const router = express.Router()

const {
    createProduct,
    getAProduct,
    getAllProducts,
    updateAProduct
} = require("../controllers/product.js")

router.post("/", createProduct)
router.get("/:id", getAProduct)
router.get("/", getAllProducts)
router.patch("/:id", updateAProduct)

module.exports = router