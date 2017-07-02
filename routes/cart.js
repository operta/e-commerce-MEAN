var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var Product = require('../models/product');
var Cart = require('../models/cart');

router.get('/', function (req, res, next) {
    res.redirect('/products');
});


router.get('/purchase', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Cart.find({'user': decoded.user._id, 'isPurchased': true },  function (err, orders) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!orders) {
            return res.status(500).json({
                title: 'Narudžbe nisu pronađene!',
                error: {message: 'Narudžbe nisu pronađene!'}
            });
        }

        res.status(200).json({
            message: 'Uspijeh',
            obj: orders
        });
    });
});

router.get('/storePurchase/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Cart.find({'store': req.params.id, 'isPurchased': true },  function (err, orders) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!orders) {
            return res.status(500).json({
                title: 'Narudžbe nisu pronađene!',
                error: {message: 'Narudžbe nisu pronađene'}
            });
        }

        res.status(200).json({
            message: 'Uspijeh',
            obj: orders
        });
    });
});



router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'secret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Neuspjela autentikacija',
                error: {message: "Za kupovinu je potrebna prijava ili registracija"}
            });
        }
        next();
    })
});


router.get('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);

    Cart.findById(req.params.id,  function (err, cart) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!cart) {
            return res.status(500).json({
                title: 'Korpica nije pronađena!',
                error: {message: 'Korpica nije pronađena!'}
            });
        }


        Product.find({'_id': { $in: cart.products }}, function(err, products){
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se pogreška',
                    error: err
                });
            }
            if (!products) {
                return res.status(500).json({
                    title: 'Proizvodi nisu pronađeni!',
                    error: {message: 'Proizvodi nisu pronađeni!'}
                });
            }

            res.status(200).json({
                message: 'Uspijeh',
                obj: products
            });
        });
    });
});


router.post('/', function (req, res, next) {

    var decoded = jwt.decode(req.query.token);

    var cart = new Cart({
        user: decoded.user._id
    });

    cart.save(function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }

        cart.save();
        res.status(201).json({
            message: 'Korpica kreirana',
            obj: result
        });
    });

});

router.patch('/:id', function (req, res, next) {

    var decoded = jwt.decode(req.query.token);

    Cart.findById(req.params.id, function (err, cart) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!cart) {
            return res.status(500).json({
                title: 'Korpica nije pronađena!',
                error: {message: 'Korpica nije pronađena!'}
            });
        }

        cart.store = req.body.storeId;
        cart.products.push(req.body.productId);


        cart.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se pogreška',
                    error: err
                });
            }
            cart.save();

        });
    });

    Product.findById(req.body.productId,  function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!result) {
            return res.status(500).json({
                title: 'Proizvod nije pronađen!',
                error: {message: 'Proizvod nije pronađen!'}
            });
        }
        if(result.salePrice != 0 && result.salePrice != null){
            result.price = result.salePrice;
        }

        res.status(200).json({
            message: 'Proizvod dodan u korpicu',
            obj: result
        });

    });

});

router.patch('/purchase/:id', function (req, res, next) {

    var decoded = jwt.decode(req.query.token);

    Cart.findById(req.params.id, function (err, cart) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!cart) {
            return res.status(500).json({
                title: 'Korpica nije pronađena!',
                error: {message: 'Korpica nije pronađena'}
            });
        }



        cart.isPurchased = true;


        cart.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se greška',
                    error: err
                });
            }
            cart.save();

            res.status(200).json({
                message: 'Uspješna narudžba',
                obj: result
            });

        });
    });


});

router.patch('/updateOrderStatus/:id', function (req, res, next) {

    var decoded = jwt.decode(req.query.token);

    Cart.findById(req.params.id, function (err, cart) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!cart) {
            return res.status(500).json({
                title: 'Narudžba nije pronađena!',
                error: {message: 'Narudžba nije pronađena'}
            });
        }



        cart.isChecked = req.body.isChecked;


        cart.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se greška',
                    error: err
                });
            }
            cart.save();

            res.status(200).json({
                message: 'Status osvježen',
                obj: result
            });

        });
    });


});

router.patch('/remove/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);

    Cart.findById(req.params.id, function (err, cart) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!cart) {
            return res.status(500).json({
                title: 'Korpica nije pronađena!',
                error: {message: 'Korpica nije pronađena!'}
            });
        }



        cart.products.pull(req.body.productId);


        cart.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se greška',
                    error: err
                });
            }
            cart.save();

            res.status(200).json({
                message: 'Proizvod izbrisan iz korpice',
                obj: result
            });

        });

    });

});

module.exports = router;