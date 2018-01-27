const mongoose = require('mongoose');

const schema = mongoose.Schema({
    title: {
        type: String,
        required: true,

    },
    message: {
        type: String,
        default: "This is for you with love. Enjoy and pass on the kindness."
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
{
    timestamps: { createdAt: 'created_at'}
}
);

module.exports = mongoose.model("Sticky", schema);