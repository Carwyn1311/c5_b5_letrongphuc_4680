var express = require('express');
var router = express.Router();
let productModel = require('../schemas/product');

function buildQuery(obj) {
    let result = {};
    if (obj.name) {
        result.name = new RegExp(obj.name, 'i');
    }
    if (obj.price) {
        result.price = {
            $gte: obj.price.$gte || 0,
            $lte: obj.price.$lte || 10000
        };
    }
    result.isDeleted = false;
    return result;
}

router.get('/', async (req, res) => {
    let products = await productModel.find(buildQuery(req.query));
    res.status(200).send({ success: true, data: products });
});

router.get('/:id', async (req, res) => {
    try {
        let product = await productModel.findOne({ _id: req.params.id, isDeleted: false });
        if (!product) throw new Error('Sản phẩm không tồn tại hoặc đã bị xóa');
        res.status(200).send({ success: true, data: product });
    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        let newProduct = new productModel(req.body);
        await newProduct.save();
        res.status(200).send({ success: true, data: newProduct });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        let updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) throw new Error('Sản phẩm không tồn tại');
        res.status(200).send({ success: true, data: updatedProduct });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        let deletedProduct = await productModel.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!deletedProduct) throw new Error('Sản phẩm không tồn tại');
        res.status(200).send({ success: true, message: 'Sản phẩm đã được xóa mềm' });
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
});

module.exports = router;