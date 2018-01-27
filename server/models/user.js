const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username: { 
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    address: String,
    city: String,
    state: String,
    zipcode: String,
    phone: String,
    stickies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sticky"        
    }]
});

module.exports = mongoose.model("User", schema);