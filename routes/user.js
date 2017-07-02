var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var User = require('../models/user');

router.get('/', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id)
        .exec(function (err, user) {
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se pogreška',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Uspijeh',
                obj: user
            });
        });
});

router.post('/', function (req, res, next) {
    var user = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email
    });
    user.save(function(err, result) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        res.status(201).json({
            message: 'Korisnički račun kreiran',
            obj: result
        });
    });
});

router.post('/signin', function(req, res, next) {
    User.findOne({email: req.body.email}, function(err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!user) {
            return res.status(401).json({
                title: 'Prijava neuspješna',
                error: {message: 'Email ili lozinka netačni'}
            });
        }
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(401).json({
                title: 'Prijava neuspješna',
                error: {message: 'Email ili lozinka netačni'}
            });
        }
        var token = jwt.sign({user: user}, 'secret', {expiresIn: 604800});
        res.status(200).json({
            message: 'Uspiješno prijavljen',
            token: token,
            userId: user._id
        });
    });
});

router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, 'secret', function (err, decoded) {
        if (err) {
            return res.status(401).json({
                title: 'Niste prijavljeni',
                error: err
            });
        }
        next();
    })
});


router.get('/:id', function(req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(req.params.id, function (err, user) {

        res.status(200).json({
            message: 'Uspijeh',
            obj: user
        });

    });
});



router.patch('/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!user) {
            return res.status(500).json({
                title: 'Korisnički račun nije pronađen',
                error: {message: 'Korisnički račun nije pronađen'}
            });
        }
        if (req.params.id != decoded.user._id) {
            return res.status(401).json({
                title: 'Niste prijavljeni',
                error: {message: 'Pokušajte sa ponovnom prijavom'}
            });
        }

        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.username = req.body.username;
        user.image = req.body.image;
        user.address = req.body.address;
        user.city = req.body.city;
        user.state = req.body.state;
        user.country = req.body.country;
        console.log(user);
        user.save(function (err, result) {
            if (err) {
                return res.status(500).json({
                    title: 'Dogodila se pogreška',
                    error: err
                });
            }
            res.status(200).json({
                message: 'Podatci sačuvani',
                obj: result
            });
        });
    });
});

router.patch('/changePassword/:id', function (req, res, next) {
    var decoded = jwt.decode(req.query.token);
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: err
            });
        }
        if (!user) {
            return res.status(500).json({
                title: 'Dogodila se pogreška',
                error: {message: 'Korisnik nije pronađen'}
            });
        }
        if (req.params.id != decoded.user._id) {
            return res.status(401).json({
                title: 'Prijava neuspješna',
                error: {message: 'Korisnici se ne podudaraju'}
            });
        }
        if (!bcrypt.compareSync(req.body.pass1, user.password)) {
            return res.status(401).json({
                title: 'Greška',
                error: {message: 'Netačna lozinka'}
            });
        }

        user.password = bcrypt.hashSync(req.body.pass2, 10);
            user.save(function (err, result) {
                if (err) {
                    return res.status(500).json({
                        title: 'Dogodila se pogreška',
                        error: err
                    });
                }
                res.status(200).json({
                    message: 'Lozinka promijenjena',
                    obj: result
                });
            });
    });
});

module.exports = router;
