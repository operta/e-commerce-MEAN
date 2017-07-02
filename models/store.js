/**
 * Created by dany_ on 4.5.2017..
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = require('./user');
var Reviews = new Schema({
        content: String,
        rating: Number,
        user: {type: Schema.Types.ObjectId, ref: 'User'}
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
);
var schema = new Schema({
        name: {type: String},
        description: {type: String},
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        products: [{type: Schema.Types.ObjectId, ref: 'Product'}],
        aboutUs: {type: String},
        reviews: [Reviews],
        logo: {type: String},
        gallery: [String],
        isActive: {type: Boolean}
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
);


module.exports = mongoose.model('Store', schema);