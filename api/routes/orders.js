const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/orders-model');
const Product = require('../models/product-model');

const compareObjects = require('../additional-functionality/compareObjectKeys');

router.get('/', (req, res, next) => {
    Order
        .find()
        .select('_id product quantity')
        .populate('product', 'name')
        .exec()
        .then(doc => {
            res.status(200).json(doc);
        })
        .catch(err => {
            res.status(500).json(err);
        })
});

router.post('/', (req, res, next) => {
    Product
        .findById(req.body.productID)
        .then(product => {
            if(!(compareObjects.compareKeys(req.body, orderOps))){
                res.status(400).json({
                    message: 'Not valid JSON received'
                });
            } else {
                const order = new Order({
                    _id: mongoose.Types.ObjectId(),
                    quantity: req.body.quantity,
                    product: req.body.productID
                });
                order
                    .save()
                    .then(result => {
                        res.status(201).json({
                            message: 'Order was created',
                            createdOrder: {
                                id: result.id,
                                product: result.product,
                                quantity: result.quantity
                            }
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: 'Error. Order was not created',
                            error: err
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Product not found',
                error: err
            });
        });

    const orderOps = {
        quantity: req.body.quantity,
        productID: req.body.productID
    };
});

router.get('/:orderID', (req, res, next) => {
    const id = req.params.orderID;
    Order
        .findById(id)
        .populate('product', 'name')
        .exec()
        .then(doc => {
            res.status(200).json({
                id: doc._id,
                productID: doc.product,
                quantity: doc.quantity,
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

router.delete('/:orderID', (req, res, next) => {
    const id = req.params.productID;
    Order
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