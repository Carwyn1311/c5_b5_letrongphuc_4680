var express = require('express');
var router = express.Router();
let productModel = require('../models/product');

function buildQuery(obj) {
  let result = {};
  if (obj.name) {
    result.name = new RegExp(obj.name, 'i');
  }
  result.price = {};
  if (obj.price) {
    result.price.$gte = obj.price.$gte || 0;
    result.price.$lte = obj.price.$lte || 10000;
  }
  return result;
}

// GET all products
router.get('/', async (req, res) => {
  try {
    let products = await productModel.find(buildQuery(req.query));
    res.status(200).send({ success: true, data: products });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

// GET product by id
router.get('/:id', async (req, res) => {
  try {
    let product = await productModel.findById(req.params.id);
    if (!product) throw new Error('Product not found');
    res.status(200).send({ success: true, data: product });
  } catch (error) {
    res.status(404).send({ success: false, message: error.message });
  }
});

// POST create new product
router.post('/', async (req, res) => {
  try {
    let newProduct = new productModel({
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      category: req.body.category
    });
    await newProduct.save();
    res.status(201).send({ success: true, data: newProduct });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

// PUT update product by id
router.put('/:id', async (req, res) => {
  try {
    let updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) throw new Error('Product not found');
    res.status(200).send({ success: true, data: updatedProduct });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }
});

// DELETE product by id
router.delete('/:id', async (req, res) => {
  try {
    let deletedProduct = await productModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) throw new Error('Product not found');
    res.status(200).send({ success: true, message: "Deleted successfully!" });
  } catch (error) {
    res.status(404).send({ success: false, message: error.message });
  }
});

module.exports = router;
