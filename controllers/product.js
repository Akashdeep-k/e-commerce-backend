const Product = require("../models/product.js")
const asyncHandler = require("express-async-handler")
const slugify = require("slugify")

const createProduct = asyncHandler(async (req, res) => {
    req.body.slug = slugify(req.body.title)
    try {
        const product = await Product.create(req.body)
        res.json(product)
    } catch (e) {
        throw new Error(e)
    }
})

const getAProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findById(id)
        res.json(product)
    } catch (e) {
        throw new Error(e)
    }
})

module.exports = {
    createProduct,
    getAProduct
}