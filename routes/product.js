const express = require("express")
const router = express.Router()

const {
    createProduct
} = require("../controllers/product.js")

router.post("/create", createProduct)

module.exports = router