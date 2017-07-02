var express = require('express');
var router = express.Router();
var multer = require("multer");


router.get('/', function (req, res, next) {
    res.render('index');
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/img/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})


router.post("/upload", multer({ storage: storage }).array("uploads[]", 12), function(req, res) {
    res.send(req.files);
});

module.exports = router;
