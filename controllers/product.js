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

        //Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ")
            query = query.sort(sortBy)
        }
        else {
            query = query.sort("createdAt")
        }

        //Fields
        if (req.query.fields) {
            const fields = req.query.fields.split(",").join(" ");
            query = query.select(fields)
        }
        else {
            query = query.select("-__v")
        }

        //Pagination
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);
        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This Page does not exists");
        }

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