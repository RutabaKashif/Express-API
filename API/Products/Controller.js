const Product = require("./Model");
const { connect } = require("mongoose");
require("dotenv").config();

const getAllProducts = async (req, res) => {
  try {
    await connect(process.env.MONGO_URL);
    const allProducts = await Product.find();
    res.json({
      Product: allProducts,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  const { _id } = req.query;

  try {
    await connect(process.env.MONGO_URL);
    const Product = await Product.findOne({ _id });
    res.json({ Product });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getProductByName = async (req, res) => {
  const { ProductName } = req.params;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Product = await Product.findOne({ ProductName });
    res.json({ Product });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  const { ProductName, ProductImage } = req.body;

  if (!ProductName || !ProductImage) {
    res.status(403).json({
      message: "Missing Required Field",
    });
  } else {
    try {
      await connect(process.env.MONGO_URI);
      const checkExisting = await Product.exists({ ProductName });

      if (checkExisting) {
        res.status(400).json({
          message: "Product Already Exists",
        });
      } else {
        await Product.create({ ProductName, ProductImage });
        const allProducts = await Product.find();

        res.json({
          message: "DB Connected",
          Product: allProducts,
        });
      }
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
};

const deleteProduct = async (req, res) => {
  const { _id } = req.body;

  try {
    await connect(process.env.MONGO_URI);
    await Product.deleteOne({ _id });
    const Product = await Product.find();
    res.status(200).json({
      message: "Deleted Successfully",
      Product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  const { _id, ProductName, ProductImage } = req.body;

  const filter = { _id };
  const update = { ProductName, ProductImage };

  try {
    await connect(process.env.MONGO_URI);

    await Product.findOneAndUpdate(filter, update, {
      new: true,
    });

    const Product = await Product.find();

    res.json({
      message: "Successfully updated",
      Product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
module.exports = {
  getAllProducts,
  getProductById,
  getProductByName,
  createProduct,
  updateProduct,
  deleteProduct,
};
