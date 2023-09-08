const express = require("express")
const router = express.Router()

const {
    createProduct,
    getAProduct,
    getAllProducts
} = require("../controllers/product.js")

router.post("/", createProduct)
router.get("/:id", getAProduct)
router.get("/", getAllProducts)

module.exports = router