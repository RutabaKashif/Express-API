const express = require("express");
const router = express.Router();
const controller = require("./Controller");

router.post("/createProduct", controller.createProduct);
router.get("/allProducts", controller.getAllProducts);
router.put("/updateProduct", controller.updateProduct);
router.delete("/deleteProduct", controller.deleteProduct);

module.exports = router;