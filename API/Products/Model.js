const { Schema, model } = require('mongoose')

const ProductSchema = new Schema(
    {
        ProductName: {
            type: String,
            unique: true,
            required: true
        },
        ProductImage: {
            type: String,
            required: true
        }
    }
)

const Product = model('product', ProductSchema)
module.exports = Product
