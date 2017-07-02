var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var Product = require('../models/product');
var Store = require('../models/store');

router.get('/', function (req, res, next) {
    Product.find()
        .exec(function (err, products) {
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se pogreška',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Uspjeh',
                obj: products
            });
        });
});

router.get('/:id', function (req, res, next) {
    Product.findById(req.params.id,  function (err, product) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!product) {
            return res.status(500).json({
                title: 'Proizvod nije pronađen!',
                error: {message: 'Proizvod nije pronađen'}
            });
        }

        res.status(200).json({
            message: 'Uspijeh',
            obj: product
        });
    });
});

router.get('/store/:id', function (req, res, next) {
    Product.find({'store' : req.params.id},  function (err, product) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!product) {
            return res.status(500).json({
                title: 'Prodavnica nije pronađena!',
                error: {message: 'Prodavnica nije pronađena'}
            });
        }

        res.status(200).json({
            message: 'Uspijeh',
            obj: product
        });
    });
});

router.get('/review/:id', function (req, res, next) {
    Product.findById(req.params.id,  function (err, product) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!product) {
            return res.status(500).json({
                title: 'Proizvod nije pronađen!',
                error: {message: 'Proizvod nije pronađen'}
            });
        }

        res.status(200).json({
            message: 'Uspijeh',
            obj: product.reviews
        });
    });
});

router.patch('/review/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);

    Product.findById(req.params.id, function (err, product) {
        if (err) {
            return res.status(500).json({
                title: '1',
                error: err
            });
        }
        if (!product) {
            return res.status(500).json({
                title: 'Proizvod nije pronađen!',
                error: {message: 'Proizvod nije pronađen'}
            });
        }

        console.log(product);

        product.reviews.push(
            { content: req.body.content,
                rating: req.body.rating,
                user: decoded.user._id});

        var obj =
            '{ "content":"' + req.body.content +
            '", "rating":"' + req.body.rating +
            '", "user": "' + decoded.user._id +
            '"}';
        var result = JSON.parse(obj);

        product.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: '2',
                    error: err
                });
            }
            product.save();


        });

        res.status(200).json({
            message: 'Recenzija dodana',
            obj: result
        });

    });
});


router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'secret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Neuspjela Autentikacija',
                error: err
            });
        }
        next();
    })
});

router.post('/:id', function (req, res, next) {
        var decoded = jwt.decode(req.query.token);
        Store.findById(req.params.id, function (err, store) {
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se pogreška',
                    error: err
                });
            }

        var product = new Product({
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            salePrice: req.body.salePrice,
            quantity: req.body.quantity,
            isActive: req.body.isActive,
            onSale: req.body.onSale,
            shortDescription: req.body.shortDescription,
            longDescription: req.body.longDescription,
            image: req.body.image,
            store: store
        });
        console.log(product);
        product.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se pogreška',
                    error: err
                });
            }

            product.save();
            res.status(201).json({
                message: 'Proizvod spašen',
                obj: result
            });
            console.log(result);
        });

    });
});

router.patch('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Product.findById(req.params.id, function (err, product) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!product) {
            return res.status(500).json({
                title: 'Proizvod nije pronađen',
                error: {message: 'Proizvod nije pronađen'}
            });
        }

        product.name = req.body.name;
        product.category = req.body.category;
        product.price = req.body.price;
        product.salePrice = req.body.salePrice;
        product.quantity = req.body.quantity;
        product.isActive = req.body.isActive;
        product.onSale = req.body.onSale;
        product.shortDescription = req.body.shortDescription;
        product.longDescription = req.body.longDescription;
        product.image = req.body.image;

        product.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se pogreška',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Proizvod updateovan',
                obj: result
            });
        });
    });
});


router.delete('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Product.findById(req.params.id, function (err, product) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!product) {
            return res.status(500).json({
                title: 'Proizvod nije pronađen!',
                error: {message: 'Proizvod nije pronađen'}
            });
        }

        product.remove(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se pogreška',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Proizvod izbrisan',
                obj: result
            });
        });
    });
});

module.exports = router;