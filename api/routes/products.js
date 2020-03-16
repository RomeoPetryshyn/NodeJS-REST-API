const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Product = require('../models/product-model');

const compareObjects = require('../additional-functionality/compareObjectKeys');

router.get('/', (req, res, next) => {
    Product
        .find()
        .select('name price id')
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

router.post('/', (req, res, next) => {
    const productOps = {
        name: req.body.name,
        price: req.body.price
    };
    if(!(compareObjects.compareKeys(req.body, productOps))){
        res.status(400).json({
            message: 'Not valid JSON received'
        });
    } else {
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            price: req.body.price
        });
        product
            .save()
            .then(result => {
                res.status(201).json({
                    message: 'Product was created',
                    createdProduct: {
                        id: result.id,
                        name: result.name,
                        price: result.price
                    }
                });
            })
            .catch(err => {
                res.status(500).json({
                    message: 'Error. Product was not created',
                    error: err
                });
            });
    }
});

router.get('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product
        .findById(id)
        .exec()
        .then(doc => {
            res.status(200).json({
                id: doc._id,
                name: doc.name,
                price: doc.price,
            });
        })
        .catch(err => {
            if(!mongoose.Types.ObjectId.isValid(id)){
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            } else {
                res.status(500).json({
                    message: 'Error. Could not return product data',
                    error: err
                });
            };
        });
});

router.patch('/:productID', (req, res, next) => {
    const id = req.params.productID;
    const updateOps = {
        name: req.body.name,
        price: req.body.price
    };
    if(!(compareObjects.compareKeys(req.body, updateOps))){
        res.status(400).json({
            message: 'Not valid JSON received'
        });
    } else {
        Product
            .updateOne({ _id: id }, { $set: updateOps })
            .exec()
            .then(result => {
                res.status(200).json(result);
            })
            .catch(err => {
                res.status(500).json({
                error: err
            });
        });
    };
});

router.delete('/:productID', (req, res, next) => {
    const id = req.params.productID;
    Product
        .deleteOne({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;