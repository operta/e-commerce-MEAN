var mongoose = require('mongoose');

var schema = new mongoose.Schema({
        name: String,
        description: String,
        content: String,
        image: String,
        forStore: Boolean
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    });

module.exports = mongoose.model('Learning', schema);