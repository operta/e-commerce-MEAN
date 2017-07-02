var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var Category = require('../models/category');


router.get('/', function (req, res, next) {
    Category.find()
        .exec(function (err, categories) {
            if (err) {
                return res.status(500).json({
                    title: 'An error occurred',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: categories
            });
        });
});



router.post('/', function (req, res, next) {


    var category = new Category({
        name: req.body.name,
        image: req.body.image
    });

    category.save(function (err, result) {
        if (err) {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }

        category.save();
        res.status(201).json({
            message: 'Saved message',
            obj: result
        });
        console.log(result);
    });

});


module.exports = router;