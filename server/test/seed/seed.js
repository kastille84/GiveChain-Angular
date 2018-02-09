const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const Sticky = require('./../../models/sticky');
const User = require('./../../models/user');
const {tks} = require('./../../config/config');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const salt = bcrypt.genSaltSync(10);
const password = bcrypt.hashSync("test4400", salt);
const userOneToken = jwt.sign({id: userOneId}, tks).toString();
const userTwoToken = jwt.sign({id: userTwoId}, tks).toString();

// create dummy users
const users = [
    {
        _id: userOneId,
        username: "kastille84",
        email: "kastille84@gmail.com",
        password: password,
        name: "Rosa's Pizza",
        url: 'RosasPizza123',
        address: "75 Liberty st. w.h.",
        city: "Newburgh",
        state: "NY",
        zipcode: "12550",
        phone: "8454013350",
        verified: true
    }, 
    {
        _id: userTwoId,
        username: "doogard84",
        email: "doogard84@gmail.com",
        password: password,
        name: "Doogard's Pizza'",
        url: "DoogardsPizza123",
        address: "75 Liberty st. w.h.",
        city: "Newburgh",
        state: "NY",
        zipcode: "12550",
        phone: "8454013350",
        verified: false
    }
];

const stickies = [
    {
        title: "Cheese Pizza",
        message: "Enjoy this On Us!",
        from: "Nasir Jones",
        restaurant: userOneId
    },
    {
        title: "Peperroni Pizza",
        message: "Enjoy this On Us!",
        from: "Victor Santiago",
        restaurant: userOneId
    },
    {
        title: "Sicilian Pizza",
        message: "Enjoy this On Us!",
        from: "Anthony Cruz",
        restaurant: userOneId
    },
    {
        title: "Sausage Pizza",
        message: "Enjoy this On Us!",
        from: '',
        restaurant: userTwoId
    },
    {
        title: "Breakfast Pizza",
        message: "Enjoy this On Us!",
        from: "Edwin Martinez",
        restaurant: userTwoId
    }
];

const populateUsers = function (done) {
    this.timeout(5000);
    User.remove({}).then( () => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then( () => {
        done();
    });

};        

const populateStickies = function (done) {
    Sticky.remove({}).exec().then( () => {
        return Sticky.insertMany(stickies);
    }).then( () => {
        done();
    });
};


module.exports = {
    users,
    stickies,
    populateStickies,
    populateUsers,
    userOneToken,
    userTwoToken
};