/**
 * Created by dany_ on 4.5.2017..
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Store = require('./store.js')

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
        category: {type: String},
        price: {type: Number},
        salePrice: {type: Number},
        quantity: {type:Number},
        isActive: {type: Boolean},
        onSale: {type: Boolean},
        shortDescription: {type: String},
        longDescription: {type: String},
        image: {type: String},
        reviews: [Reviews],
        store: {type: Schema.Types.ObjectId, ref: 'Store'}
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
);

schema.post('remove', function (product) {
    Store.findById(product.store, function (err, store) {
        if(store)
        {
            store.products.pull(product);
            store.save();
        }

    });
});

module.exports = mongoose.model('Product', schema);