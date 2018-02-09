const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const {check, validationResult} = require('express-validator/check');
const async = require('async');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randomString = require('random-string');
const nodemailer = require('nodemailer');

const User = require('../models/user');
const Sticky = require('../models/sticky');
const {tks, email, pemail, urlEnv} = require('../config/config');

mongoose.connect('mongodb://localhost:27017/givechain');
mongoose.Promise= global.Promise;

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

const authenticate = (req, res, next) => {
    // get token from header in the frontend
    const token = req.headers.auth;
    // check token
    jwt.verify(token, tks, (err, decoded) => {
        if (decoded) {
            req.decoded = decoded;
            next();
        }
        if (err) {
            console.log(token);
            return res.status(401).json({errors: err, token: token});
        }
    });
    
    
};

// ROUTES GO HERE

    // Register User
router.post('/register',[ 
        check("username")
            .isAlphanumeric()
            .isLength({min:6, max: 20})
            .exists()
            .trim(),
        check("email")
            .exists()
            .isEmail()
            .normalizeEmail()
            .matches(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)
            .isLength({max:100})
            .trim(),
        check("password")
            .isAlphanumeric()
            .exists()
            .isLength({min:5})
            .trim(),
        check("name")
            .exists()
            .trim(),
        check("url")
            .exists()
            .trim(),
        check("address")
            .exists()
            .trim(),
        check("city")
            .exists()
            .trim(),
        check('state')
            .exists()
            .trim(),
        check('zipcode')
            .exists()
            .isLength({max: 20})
            .trim(),
        check('phone')
            .exists()            
            .trim()
    ], 
    (req, res) => {
        // check validity of values        
        const result = validationResult(req);
        if (!result.isEmpty()) {
            // there are validation errors               
            return res.status(400).json({errors: "something went wrong"});
        }
        // hash password before saving
        const salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        const vhash = randomString({length:20});
        const restaurant = new User({
            "username": req.body.username,
            "email": req.body.email,
            "password": hash,
            "name": req.body.name,
            "url": req.body.url,
            "address": req.body.address,
            "city": req.body.city,
            "state": req.body.state,
            "zipcode": req.body.zipcode,
            "phone": req.body.phone,
            "verifyHash": vhash,
            "verified" : false
        });
        restaurant.save((err, result) => {
            if (err) {
                return res.status(500).json({errors: err});
            }
            // NODE MAILER
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                auth: {
                    user: email,
                    pass: pemail
                }
            });
            // setting up the data to send off
            //#TODO - change localhost url in html to reflect production email
            const mailOptions = {
                from: `"Edwin at GiveChain" <${email}> `,
                to: req.body.email,
                subject: "GiveChain Needs Email Verification",
                html: "<h2>Hey " + req.body.name + "</h2><h3>Thank you for registering to GiveChain</h3><p>For sercurity reasons, we need to verify that you are the person/entitfy that just registered with us. </p><p>Please click on the link below to complete verification</p><br><a href='" + urlEnv+"api/register/" + result._id+"/" + vhash + "'>VERIFY HERE</a>"
            };
            // send mail
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) return console.log("nodemailer", err);
                
                return res.status(200).json({
                    restaurant: result,
                    verified: false
                }); 
            });

        });

});

router.get('/register/:id/:hash', (req, res) => {
    // grab the params
    const id= req.params['id'];
    const hash = req.params['hash'];

    // query the USER collection for an id
    User.findByIdAndUpdate(id, {
        verified: true
    }).exec()
        .then(user => {
            //res.status(200).json({verified: true});
            // redirect
            res.redirect(200, urlEnv+'login');
        })
        .catch(err => {
            res.status(500).json({error: 'could not verify'});
        });

});

    // Login User
router.post('/login', [ 
        check('username')
            .exists()
            .trim(),
        check('password')
            .exists()
            .trim()
    ], 
    (req, res) => {
    // validate values
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(500).json({errors: result});
    }
    
    // check username, password credentials
    User.findOne({username: req.body.username}).exec()
        .then(user => {      
            // user hasn't been verified.. don't go any further
            if (user.verified === false) {
                return res.status(500).json({verify: false});
            }  
            // verified at this point
            bcrypt.compare(req.body.password, user.password, (err, same) => {
                if (err) {
                    return res.status(500).json({errors: err});
                }
                // same is true
                if (same) {
                    // passwords match
                        // create token
                        const token = jwt.sign({id: user._id, access: 'auth'}, tks, {expiresIn: '2h'});
                        //const decoded = jwt.decode(token, {complete: true});
                       
                        // send  token & "success" message to front end
                        return res.status(200).json({
                            message: 'Auth Success',
                            token: token,
                            expiresAt: new Date().getTime() + 7200000
                        });
                }

                //failed login, bad credentials
                res.status(403).json({
                    message:"Auth Failed"
                });
            })
        })
        .catch(e=> {
            // username doens't exist
            res.status(500).json({error: 'fail'});
        });
});

    // Get All Stickies
router.get('/sticky', (req, res) => {
    // ?city=newburgh&state=ny
    const city = req.query.city;
    const state = req.query.state

    if (!city || ! state) {
        return res.status(500).json({error: "Missing City and/or State"});
    }
    // get all stickies
    let stickyArray = [];
    
    Sticky.find({}).populate("restaurant").exec()
        .then( 
            (stickies) => {
                for(sticky of stickies) {
                    if ( (sticky.restaurant.city).toLowerCase() == city.toLowerCase() &&
                        (sticky.restaurant.state).toLowerCase() == state.toLowerCase()) {
                            stickyArray.push(sticky);
                    }
                }
                if (stickyArray.length == 0) {
                    // doesn't match city and or state
                    return res.status(404).json({error: "Incorrect City/State Combination"});         

                }
                return res.status(200).json({
                    stickyArray,
                    message: "Got All Stickies"
                    });
                           
            }
        );

    
});

// #TODO - protect these routes below using jwt

    // Create Sticky
router.post('/sticky', authenticate, [
        check("title")
            .exists()
            .isLength({ max:50})
            .trim(),
        check('message')
            .isLength({max:150})
            .trim(),
        check('from')
            .isLength({max:50})
            .trim()

    ], 
    (req, res) => {
        // check validity of values
        const result = validationResult(req);
        if (!result.isEmpty()) {
            // there are validation errors               
            return res.status(501).json({errors: result});
        }

        // find user associated with the stickies
        // get restaurant_id from decoded jwt  
        const id = req.decoded.id;
            // currently we are just grabbing the 1st user on the collection
        // #TODO - currently saved sticky must be associated with user        
        User.findOne({_id: id}).then((doc) => {            
            const sticky = new Sticky({
                "title": req.body.title,
                "message": req.body.message,
                "restaurant": doc._id
            });
            sticky.save((err, result) => {
                if (err) {
                    return res.status(500).json({error: "Somethingo went wrong"});
                }
                return res.status(200).json({
                        restaurant: result,
                        message: "Sticky Added Successfully"
                    });
            });
        }).catch(e => {
            // could not find user with said id
            return res.status(500).json({error:"Somethingz went wrong"})
        });

        
});

    // Update Sticky
router.patch('/sticky', authenticate, [
        check("title")
            .exists()
            .isLength({max:50})
            .trim(),
        check('message')
            .isLength({max:150})
            .trim()
    ], 
    (req, res) => {
        // check validity
        const result = validationResult(req);
        if (!result.isEmpty()) {
            // there are validation errors               
            return res.status(501).json({errors: result});
        }

        // update record
            // assume we will get sticky id through req.body
        const id = req.body.id;
        Sticky.findByIdAndUpdate(id, {
                title: req.body.title,
                message: req.body.message
            }, {new: true}).exec()
            .then( sticky => {
                return res.status(200).json( {
                    sticky,
                    message: "Sticky Updated Successfully"
                });
            })
            .catch(e=> {
                return res.status(501).json({errors: e});
            });

});

    // Delete Sticky
router.delete('/sticky/:id', authenticate, (req, res) => {
    // get sticky id from req.body
    const id = req.params.id;

    Sticky.findByIdAndRemove(id).exec()
        .then(sticky => {
            if (!sticky) {
                return res.status(500).json({message: 'No Sticky found in db'})
            }
            return res.status(200).json({
                sticky,
                message: "Sticky Deleted"
            });
        })
        .catch(e => {
            return res.status(500).json(e);
        });

});


    // *** sample route: localhost:3000/api/users
//  router.get('/users', (req, res) => {
//     var user = new User({
//         username: "kastille84"
//     });
//     user.save();
//     res.status(200).json({
//         message: "success sucka"
//     });
    
//  });



module.exports = router;