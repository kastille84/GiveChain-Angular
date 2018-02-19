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
    from: {
        type: String
    },
    reserved: {
        type: Boolean,
        default: false
    },
    reservedBy: {
        type: String,
        default: null
    },
    reservedDate: {
        type: Date,
        default: null
    },
    redeemed: {
        type: Boolean,
        default: false
    },
    redeemedDate: {
        type: Date,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, 
{
    timestamps: { createdAt: 'created_at'}
}
);

module.exports = mongoose.model("Sticky", schema);