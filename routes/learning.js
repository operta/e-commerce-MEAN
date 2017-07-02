var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var Learning = require('../models/learning');

router.get('/', function (req, res, next) {
    Learning.find()
        .exec(function (err, learnings) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: learnings
            });
        });
});

router.get('/:id', function (req, res, next) {
    Learning.findById(req.params.id,  function (err, learning) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!learning) {
            return res.status(500).json({
                title: 'No Message Found!',
                error: {message: 'Message not found'}
            });
        }

        res.status(200).json({
            message: 'Success',
            obj: learning
        });
    });
});



router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'secret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Not Authenticated',
                error: err
            });
        }
        next();
    })
});

router.post('/', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    console.log("TRACK2");
    var learning = new Learning({
        name: req.body.name,
        description: req.body.description,
        content: req.body.content,
        image: req.body.image,
        forStore: req.body.forStore
    });
    console.log(learning);

    learning.save(function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        learning.save();
        res.status(201).json({
            message: 'Saved Learning',
            obj: result
        });

    });
});

router.patch('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Learning.findById(req.params.id, function (err, learning) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!learning) {
            return res.status(500).json({
                title: 'No Message Found!',
                error: {message: 'Message not found'}
            });
        }

        learning.name = req.body.name;
        learning.description = req.body.description;
        learning.content = req.body.content;
        learning.image = req.body.image;
        learning.forStore = req.body.forStore;

        learning.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Updated message',
                obj: result
            });
        });
    });
});


router.delete('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    Learning.findById(req.params.id, function (err, learning) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        if (!learning) {
            return res.status(500).json({
                title: 'No Message Found!',
                error: {message: 'Message not found'}
            });
        }

        learning.remove(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Deleted message',
                obj: result
            });
        });
    });
});

module.exports = router;