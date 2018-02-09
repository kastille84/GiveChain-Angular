const expect= require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

// load in local files
const {app} = require('./../../server');
const Sticky = require('./../models/sticky');
const User = require('./../models/user');
const {users, 
    stickies, 
    populateUsers, 
    populateStickies, 
    password,
    userOneToken} = require('./seed/seed');

let firstStickyId = null;

// beforeEach, create a token
beforeEach(populateUsers);
beforeEach(populateStickies);
beforeEach( function(done){
    Sticky.findOne().exec()
        .then(
            (doc) => {
                firstStickyId = doc._id;
                done();
            },
            (e) => {done()},
            
        );
})


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
    it('should create user AND send verification email', function(done) {
        request(app)
            .post('/api/register')
            .send({
                //_id: new ObjectID(),
                username: "hoagie84",
                email: "hoagie84@gmail.com",
                password: 'test4400',
                name: "Hoagie's Pizza",
                url: "HoagiesPizza123",
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
                password: 'test4400',
                name: "Hooligan Pizza",
                url: "HooligansPizza123",
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
                password: 'test4400',
                name: "Hooligan Pizza",
                url: "HooligansPizza123",
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

describe('GET /register/id/hash', () => {
    it('should get 500 code if id param does NOT exist', function(done) {
        request(app)
            .get('/api/register/123/567')
            .expect(500)
            .end(done);
        });
        
        it('should get 200 code if id param does exist', function(done) {
            request(app)
                .get('/api/register/'+users[0]._id+'/567')
                .expect(200)
                .end(done);
    });

});

describe('POST /login', () => {

    // test 1. Should log in user with right credendtials
    it( 'should login user with correct credentials', function(done) {
        request(app)
            .post('/api/login')
            .send({
                username: 'kastille84',
                password: 'test4400'
            })
            .expect(200)
            .end(done);
    });
    // test 2. username exists but wrong password
    it('should not login user with bad password', function(done) {
        request(app)
            .post('/api/login')
            .send({
                username: 'kastille84',
                password: 'ha2wings4765'
            })
            .expect(403)
            .end(done);
    })
    // test 3. username doesn't exist
    it('should not login user if username doesnt exist', function(done) {
        request(app)
            .post('/api/login')
            .send({
                username: "hotwings447",
                password: 'yelzabubs453'
            })
            .expect(500)
            .end(done);
    });
    // test 4. They don't pass any credentials
    it('should not login if no form data is sent to us', function(done) {
        request(app)
            .post('/api/login')
            .send({})
            .expect(500)
            .end(done);
    });

    it('should not login user if NOT verified', function(done) {
        request(app)
            .post('/api/login')
            .send({
                username: 'doogard84',
                password: 'test4400'
            })
            .expect(500)
            .end(done);
    });

});

describe("POST /sticky", () => {
    // test 1. should create sticky
    it('should create sticky', function(done) {
        request(app)
            .post('/api/sticky')
            .set('auth', userOneToken)
            .send({
                title: "lasagna dinner",
                message: "Hope this fills your belly"
            })
            .expect(200)
            .end(done);            
    });
    // test 2. should not create sticky with bad token
    it('should not create sticky with bad token', function(done) {
        request(app)
            .post('/api/sticky')
            .set('auth', 'a9sugpqokw8e902jejmklasjdfa')
            .send({
                title: "lasagna dinner",
                message: "Hope this fills your belly"
            })
            .expect(401)
            .end(done); 
    })
    // test 3. should not create sticky with invalid inputs
    it ('should not create sticky with invalid input', function(done) {
        request(app)
            .post('/api/sticky')
            .set('auth', userOneToken)
            .send({
                message: '',
                title: ''
            })
            .expect(500)
            .end(done);
    });
    // test 4. should not create sticky with missing inputs
    it ('should not create sticky with missing input', function(done) {
        request(app)
            .post('/api/sticky')
            .set('auth', userOneToken)
            .send({})
            .expect(501)
            .end(done);
    });
    
});

describe('PATCH /sticky', () => {
    // test 1, should update an existing sticky
    it('should update existing sticky', function(done) {
        request(app)
            .patch('/api/sticky')
            .set('auth', userOneToken)
            .send({
                id: firstStickyId,
                title:"Pretzle with Cheese"
            })
            .expect(200)
            .end(done);
    });
    // test 2. should not update sticky if invalid id is passed
    it('should not update sticky if id is wrong', function(done) {
        request(app)
            .patch('/api/sticky')
            .set('auth', userOneToken)
            .send({
                id: '23945',
                title: "Omelet"
            })
            .expect(501)
            .end(done);
    });
    // test 3. should not update sticky if patch data is invalid
    it('should not update sticky if patch data is invalid', function(done) {
        request(app)
            .patch('/api/sticky')
            .set('auth', userOneToken)
            .send({
                id: firstStickyId
            })
            .expect(501)
            .end(done);
    });

});

describe('DELETE /sticky', () => {
    // test 1. It should delete sticky if valid id 
    it('should delete sticky if valid id', function(done) {
        request(app)
            .delete('/api/sticky/'+firstStickyId)
            .set('auth', userOneToken)
            .expect(200)
            .end( (err, res) => {
                if (err) return done(err);
    
                Sticky.findById(firstStickyId)
                    .then( sticky => {
                        expect(sticky).toBeFalsy();
                        done();
                    })
                    .catch( e => {
                        done(e);
                    });
            });
    })

    // test 2. It should not delete sticky if invalid id
    it('should not delete sticky if invalid id', function(done) {
        request(app)
            .delete('/api/sticky/1234weuojpwe')
            .set('auth', userOneToken)
            .expect(500)
            .end(done);
    })
});
