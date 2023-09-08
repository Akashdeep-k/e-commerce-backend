const express = require("express")
const router = express.Router()

const {
    createProduct,
    getAProduct,
    getAllProducts,
    updateAProduct,
    deleteAProduct
} = require("../controllers/product.js")

router.post("/", createProduct)
router.get("/:id", getAProduct)
router.get("/", getAllProducts)
router.patch("/:id", updateAProduct)
router.delete("/:id", deleteAProduct)

module.exports = router