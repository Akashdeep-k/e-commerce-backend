const express = require("express")
const router = express.Router()

const {
    createProduct,
    getAProduct
} = require("../controllers/product.js")

router.post("/", createProduct)
router.get("/:id", getAProduct)

module.exports = router