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
const __ = require('lodash');

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
        // check("url")
        //     .exists()
        //     .trim(),
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
        var hash = bcrypt.hashSync( (req.body.password).toLowerCase(), salt);
        const vhash = randomString({length:20});
        const restaurant = new User({
            "username": (req.body.username).toLowerCase(),
            "email": (req.body.email).toLowerCase(),
            "password": hash,
            "name": req.body.name,
            //"url": (req.body.url).toLowerCase(),
            "address": req.body.address,
            "city": (req.body.city).toLowerCase(),
            "state": (req.body.state).toLowerCase(),
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
    User.findOne({username: (req.body.username).toLowerCase()}).exec()
        .then(user => {      
            // user hasn't been verified.. don't go any further
            if (user.verified === false) {
                return res.status(500).json({verify: false});
            }  
            // verified at this point
            bcrypt.compare((req.body.password).toLowerCase(), user.password, (err, same) => {
                if (err) {
                    return res.status(500).json({errors: err});
                }
                console.log(same);
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
                            expiresAt: new Date().getTime() + 7200000,
                            city: user.city,
                            state: user.state,
                            name: user.name
                        });
                } else {
                    //failed login, bad credentials
                    res.status(403).json({
                        message:"Auth Failed"
                    });
                }

            })
        })
        .catch(e=> {
            // username doens't exist
            res.status(500).json({error: 'fail'});
        });
});

// Emails the User
router.post('/changePassword', [
        check('email')
            .exists()
            .trim()
            .isEmail()
    ], (req, res) => {
     // check validity of values        
     const result = validationResult(req);
     if (!result.isEmpty()) {
         // there are validation errors               
         return res.status(400).json({errors: "something went wrong"});
     }
     
    User.findOne({email: req.body.email}).exec()
        .then(user => {
            // email user
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
                subject: "GiveChain Password Change",
                html: "<h2>Hey " + user.name + "</h2><h3>You forgot your password?</h3><p>No worries. We will help you create a new password. </p><p>Please click on the link below to change password</p><br><a href='" + urlEnv+"api/newPassword/"+user._id+"/"+user.verifyHash+"'>CLICK HERE</a>"
            };
            // send mail
            transporter.sendMail(mailOptions, (err, info) => {
                if (err) return console.log("nodemailer", err);
                
                return res.status(200).json({
                    message: "email sent"
                }); 
            });
        })
        .catch(e => {
            return res.status(500).json({error: "Could not find email in our records"})
        })

})
    // Email Change Password Form
router.get('/newPassword/:id/:hash', (req, res) => {
    const id = req.params['id'];
    const hash = req.params['hash'];

    User.findOne({_id: id, verifyHash: hash}).exec()
        .then( user => {
            res.redirect(urlEnv+'newPassword/e8ekhgy29ieyhwpaiuw3iywok/'+id+'/asgw5r9483hjirus/'+hash);
        })
        .catch( e=> {
            return res.status(500).json({error: "Could not find email in our records"})
        })
})
    //Actual Change Password
router.post('/newPassword', [
        check('id')
            .exists()
            .trim(),
        check('hash')
            .exists()
            .trim(),
        check('password')
            .isAlphanumeric()
            .exists()
            .isLength({min:5})
            .trim()
    ], (req, res) => {
        // check validity of values        
     const result = validationResult(req);
     if (!result.isEmpty()) {
         // there are validation errors               
         return res.status(400).json({errors: "something went wrong"});
     }
     const id = req.body.id;
     const hash = req.body.hash;
     // hash password before saving
     const salt = bcrypt.genSaltSync(10);
     var newPassword = bcrypt.hashSync( (req.body.password).toLowerCase(), salt);

     User.findOneAndUpdate({_id: id, verifyHash: hash}, {password: newPassword}).exec()
            .then(result =>{
                return res.status(200).json({success: 'changed password'});
            })
            .catch(e => {
                return res.status(500).json({error: 'Could Not Find User Or Change Password'});
            })
});

router.post('/contact', [
        check('subject')
            .exists()
            .trim(),
        check('message')
            .exists()
            .trim(),
        check('email')
            .exists()
            .trim()
            .isEmail()
    ], (req, res) => {
       // check validity of values        
       const result = validationResult(req);
       if (!result.isEmpty()) {
           // there are validation errors               
           return res.status(400).json({errors: "something went wrong"});
       }

       // NODEMAILER
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
            from: `"Inquiry" <${req.body.email}> `,
            to: email,
            subject: req.body.subject,
            html: "<h2>Hey GiveChain Representative, </h2><h3>You have a new Inquiry from : <br> "+req.body.email+"</h3><p>Message:</p>"+req.body.message+"<p>"
        };
        // send mail
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) return console.log("nodemailer", err);
            
            return res.status(200).json({
                message: "email sent"
            }); 
        });

});

    // Get All Stickies - by setting city/state in Local Storage OR restaurant URL
router.get('/sticky', (req, res) => {
    // ?city=newburgh&state=ny
    const city = req.query.city? (req.query.city).toLowerCase() : null;
    const state = req.query.state? (req.query.state).toLowerCase() : null;
    // ?restaurant=rosaspiza
    const restaurant = req.query.restaurant? (req.query.restaurant).toLowerCase() : null;
   
    if (city && state) {
        let promise = null;
        if(!restaurant) {        
            promise = User.find({city: city, state: state}).populate('stickies').exec();
        }
        else if (restaurant) {
            promise = User.find({city: city, state: state, name: new RegExp(restaurant, 'i')})
                        .populate('stickies').exec();
        } 
        promise.then( users => { 
            if (users.length === 0) {                       
                    // doesn't match city and or state
                    return res.status(404).json({error: "Incorrect City/State Combination"});                             
            }
            
                 //loop through each user and reverse their stickies
                 for (let i = 0; i < users.length; i++) {
                    const tempStickies = users[i].stickies
                    // reverse order of stickies
                    users[i].stickies = __.reverse(tempStickies);
                 }
                                   
                    return res.status(200).json({
                        users,
                        message: "Got All Users and Their Stickies"
                        });
        });      
    } else {
        return res.status(500).json({error: 'Invalid or Missing query params'});
    }   
});

    

// Routes below protected using jwt

    // Create Sticky
router.post('/sticky', authenticate, [
        check("title")
            .exists()
            .isLength({ max:40})
            .trim(),
        check('message')
            .isLength({max:130})
            .trim(),
        check('from')
            .isLength({max:40})
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
        const newFrom = (req.body.from === null)? 'Anonymous': req.body.from;
        const newMessage = (req.body.message)? req.body.message: "I give you this food item as an act of Kindness. May you also spread love and kindness to others.";
        const colorArray = ['#C1FAF3', '#FAF681', '#FAD0CF'];
        const key = getRandomInt(3);
            // currently we are just grabbing the 1st user on the collection     
        User.findOne({_id: id}).then((doc) => {              
                const sticky = new Sticky({
                    "title": req.body.title,
                    "message": newMessage, 
                    "from":newFrom ,
                    "color": colorArray[key],
                    "user": doc._id
                });
            

            sticky.save((err, result) => {
                if (err) {
                    return res.status(500).json({error: "Something went wrong"});
                }
                // save/push  sticky_id into user array
                doc.stickies.push(result._id);
                doc.save();
                // # TODO - get the user's info into the sticky for frontend
                result.user = doc;
                return res.status(200).json({
                        sticky: result,
                        message: "Sticky Added Successfully"
                    });
            });
        }).catch(e => {
            // could not find user with said id
            return res.status(500).json({error:e})
        });

        
});

    // Update Sticky
router.patch('/sticky/edit/:id', authenticate, [
        check("title")
            .exists()
            .isLength({max:40})
            .trim(),
        check('message')
            .exists()
            .isLength({max:130})
            .trim(),
        check('from')
            .exists()
            .isLength({max:40})
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
        const id = req.params['id'];
        Sticky.findByIdAndUpdate(id, {
                title: req.body.title,
                message: req.body.message,
                from: req.body.from
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
    // * Special case * not authenticated because it can be reserved by general public
    // Reserve Sticky 
router.patch('/sticky/reserve/:id', [
        check('reserved')
            .exists()
            .isBoolean()
            .escape(),
        check('reservedBy')
            .exists()
            .trim()
            .escape()
    ], (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            console.log('im error');
            return res.status(500).json({
                error: result
            });
        }
        
        // check for xunreservex - for unreserving
        const reservedBy = (req.body.reservedBy !== 'xunreservex') ? req.body.reservedBy : null;
        const reserved = (reservedBy) ? true : false;
        const reservedDate = (reserved) ? new Date().getTime(): null;
        const id = req.body._id;
        Sticky.findByIdAndUpdate(id, {
                reserved: reserved, 
                reservedBy:reservedBy,
                reservedDate: reservedDate
            }, {new: true}).exec()
            .then( sticky => {
                return res.status(200).json( {
                    sticky,
                    message: "Sticky reserved Successfully"
                });
            })
            .catch(e=> {
                return res.status(501).json({errors: e});
            });

}) ;   
    
    // # TODO - TEST 
    // Redeem Sticky   
router.patch('/sticky/redeem/:id', authenticate, (req, res) => {
    //get id
    const id = req.params['id'];

    Sticky.findByIdAndUpdate(id, {
        redeemed: true,
        redeemedDate: new Date().getTime()
    }, {new: true}).exec()
    .then( sticky => {
        return res.status(200).json( {
            sticky,
            message: "Sticky redeemed Successfully"
        });
    })
    .catch(e=> {
        return res.status(501).json({errors: e});
    });
});


    // Delete Sticky
router.delete('/sticky/:id', authenticate, (req, res) => {
    // get sticky id from req.body
    const id = req.params['id'];
    const sticky = null;
    Sticky.findByIdAndRemove(id, {rawResult: true}, (err, result) => {
        if (err || result.value == null) {
            return res.status(500).json({
                error: "could not remove item", 
                sticky: result});
        }
        return res.status(200).json({
            sticky: result,
            message: "Sticky Deleted"
        });
    });

});

// random
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }
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