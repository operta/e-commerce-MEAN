/**
 * Created by dany_ on 4.5.2017..
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
        name: {type: String},
        image: {type: String}
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    });


module.exports = mongoose.model('Category', schema);