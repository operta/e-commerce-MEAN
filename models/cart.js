/**
 * Created by dany_ on 4.5.2017..
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
        products:  [{type: Schema.Types.ObjectId, ref: 'Product'}],
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        isPurchased: Boolean,
        store: {type: Schema.Types.ObjectId, ref: 'Store'},
        isChecked: Boolean
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
);

module.exports = mongoose.model('Cart', schema);