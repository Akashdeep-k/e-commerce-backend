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

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        //Filtering
        const filterObj = { ...req.query }
        const excludeQuery = ["page", "limit", "sort", "fields"]
        excludeQuery.forEach(query => delete filterObj[query])

        let queryStr = JSON.stringify(filterObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        let query = Product.find(JSON.parse(queryStr))

        const products = await query
        res.json(products)
    } catch (e) {
        throw new Error(e)
    }
})

const updateAProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true })

        res.json(product)
    } catch (e) {
        throw new Error(e)
    }
})

const deleteAProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const product = await Product.findByIdAndDelete(id)
        res.json(product)
    } catch (e) {
        throw new Error(e)
    }
})

module.exports = {
    createProduct,
    getAProduct,
    getAllProducts,
    updateAProduct,
    deleteAProduct
}