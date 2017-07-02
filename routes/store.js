var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var Store = require('../models/store');
var User = require('../models/user');

router.get('/', function (req, res, next) {
    res.render('index');
});

router.get('/x', function (req, res, next) {

    Store.find()
        .exec(function (err, stores) {
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se pogreška',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Uspijeh',
                obj: stores
            });
        });
});


router.get('/xy/:id', function (req, res, next) {
    console.log(req.params.id);
    Store.findById(req.params.id,  function (err, store) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!store) {
            res.status(500).json({
                message: 'Prodavnica ne postoji!',
                error: err
            });
        }


        res.status(200).json({
            message: 'Uspijeh!',
            obj: store
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

router.get('/x/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Store.find({user: req.params.id},  function (err, store) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!store || store[0] == null) {
            res.status(500).json({
                message: 'Prodavnica ne postoji!',
                obj: false
            });
        }


        res.status(500).json({
            message: 'Uspijeh!',
            obj: true
        });
    });
});



router.get('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Store.find({user: req.params.id},  function (err, store) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!store || store[0] == null) {
            return res.status(500).json({
                title: 'Prodavnica nije pronađena!',
                error: {message: 'Molimo unesite novu prodavnicu!'}
            });
        }


        res.status(200).json({
            message: 'Uspijeh!',
            obj: store[0]
        });
    });
});

router.post('/', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }

        var store = new Store({
            name: req.body.name,
            description: req.body.description,
            user: user,
            aboutUs: req.body.aboutUs,
            logo: req.body.logo
        });

        store.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se pogreška',
                    error: err
                });
            }

            store.save();
            res.status(201).json({
                message: 'Prodavnica kreirana',
                obj: result
            });
            console.log(result);
        });

    });

});


router.patch('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Store.findById(req.params.id, function (err, store) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!store) {
            return res.status(500).json({
                title: 'Prodavnica nije pronađena!',
                error: {message: 'Prodavnica nije pronađena!'}
            });
        }

        store.name = req.body.name;
        store.description = req.body.description;
        store.logo = req.body.logo;
        store.aboutUs = req.body.aboutUs;
        store.gallery = req.body.gallery;
        store.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se pogreška',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Promjene spašene',
                obj: result
            });
        });
    });
});

router.delete('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Store.findById(req.params.id, function (err, store) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!store) {
            return res.status(500).json({
                title: 'Prodavnica nije pronađena!',
                error: {message: 'Prodavnica nije pronađena!'}
            });
        }

        store.remove(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se pogreška',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Prodavnica izbrisana',
                obj: result
            });
        });
    });
});

module.exports = router;