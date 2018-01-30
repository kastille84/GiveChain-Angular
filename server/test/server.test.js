const expect= require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

// load in local files
const {app} = require('./../../server');
const Sticky = require('./../models/sticky');
const User = require('./../models/user');
const {users, stickies, populateUsers, populateStickies} = require('./seed/seed')

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