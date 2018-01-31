const expect= require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

// load in local files
const {app} = require('./../../server');
const Sticky = require('./../models/sticky');
const User = require('./../models/user');
const {users, stickies, populateUsers, populateStickies, password} = require('./seed/seed')

// beforeEach, create a token
beforeEach(populateUsers);
beforeEach(populateStickies);


// describe
describe('GET /sticky', function() {
    this.timeout(5000);

    // test 1, we should get all stickys as expected
    it('should get all stickies', function(done) {
        request(app)
            .get('/api/sticky?city=newburgh&state=ny')            
            .expect('Content-Type', /json/)
            .expect(200)
            .expect( (res) => {
                expect(res.body.stickyArray).toBeTruthy();
            })
            .end(done);
    }); 

    //test 2, we should not get stickies with wrong credentials
    it ('should not get all stickies', function(done) {

        request(app)
            .get('/api/sticky?city=na&state=na')
            .expect(404)
            .end(done);
    });

});

describe('POST /register', function() {

    // test 1, should create user
    it('should create user', function(done) {
        request(app)
            .post('/api/register')
            .send({
                //_id: new ObjectID(),
                username: "hoagie84",
                email: "hoagie84@gmail.com",
                password: 'ha2vu486',
                name: "Hoagie's Pizza",
                address: "75 Liberty st. w.h.",
                city: "Newburgh",
                state: "NY",
                zipcode: "12550",
                phone: "8454013350"
            })
            .expect(200)
            .end(done);
    });

    // test 2, shouldn't create if DUPLICATE username
    it("shouldn't create user if username already exists", function(done) {
        request(app)
            .post('/api/register')
            .send({
                username: "kastille84", // already exists
                email: "hooligan84@gmail.com",
                password: 'ha2vu486',
                name: "Hooligan Pizza",
                address: "75 Liberty st. w.h.",
                city: "Newburgh",
                state: "NY",
                zipcode: "12550",
                phone: "8454013350"
            })
            .expect(500)
            .end(done);
    });
    // test 3, shouldn't create if DUPLICATE email
    it("shouldn't create user if email already exists", function(done) {
        request(app)
            .post('/api/register')
            .send({
                username: "hoagie84", 
                email: "kastille84@gmail.com", // already exists
                password: 'ha2vu486',
                name: "Hooligan Pizza",
                address: "75 Liberty st. w.h.",
                city: "Newburgh",
                state: "NY",
                zipcode: "12550",
                phone: "8454013350"
            })
            .expect(500)
            .end(done);
    });
    // test 4, shouldn't create if Password is empty
    it("shouldn't create user if password is empty", function(done) {
        request(app)
            .post('/api/register')
            .send({
                username: "hooligan84", 
                email: "hooligan84@gmail.com",
                password: '', // empty
                name: "Hooligan Pizza",
                address: "75 Liberty st. w.h.",
                city: "Newburgh",
                state: "NY",
                zipcode: "12550",
                phone: "8454013350"
            })
            .expect(400)
            .end(done);
    });

});