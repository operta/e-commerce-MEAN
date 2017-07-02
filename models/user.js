var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');

var schema = new Schema({
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    isStore: {type: Boolean},
    firstName: {type: String},
    lastName: {type: String},
    username: {type: String, unique: true},
    image: {type: String},
    address: {type: String},
    city: {type: String},
    state: {type: String},
    country: {type: String},
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
    store: {type: Schema.Types.ObjectId, ref: 'Store'}
},
{
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', schema);