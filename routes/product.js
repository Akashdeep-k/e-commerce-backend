const express = require("express")
const router = express.Router()

const {
    createProduct
} = require("../controllers/product.js")

router.get("/create", createProduct)

module.exports = router