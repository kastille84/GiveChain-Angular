const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const {check, validationResult} = require('express-validator/check');
const async = require('async');

const User = require('../models/user');
const Sticky = require('../models/sticky');

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

// ROUTES GO HERE

    // Get All Stickies
router.get('/sticky', (req, res) => {
    // ?city=newburgh&state=ny
    const city = req.query.city;
    const state = req.query.state
    // get all stickies
    let stickyArray = [];
    
    Sticky.find({}).populate("restaurant").exec()
        .then( (stickies) => {
            for(sticky of stickies) {
                if ( (sticky.restaurant.city).toLowerCase() == city.toLowerCase() &&
                    (sticky.restaurant.state).toLowerCase() == state.toLowerCase()) {
                        stickyArray.push(sticky);
                        console.log('hi')
                }
            }            
           return  res.status(200).json({
               stickyArray,
               message: "Got All Stickies"
            });
        })
        .catch(e => {
            return res.status(500).json({error: e});
        });
    
});

    // Create Sticky
router.post('/sticky', [
        check("title")
            .exists()
            .isLength({max:50})
            .trim(),
        check('message')
            .isLength({max:150})
            .trim()

    ] 
    ,(req, res) => {
        // check validity of values
        const result = validationResult(req);
        if (!result.isEmpty()) {
            // there are validation errors               
            return res.status(501).json({errors: result});
        }

        // find user associated with the stickies
        // #TODO - need to get restaurant_id from logged in user, 
            // currently we are just grabbing the 1st user on the collection
        // #TODO - currently saved sticky must be associated with user        
        User.findOne({username: "serene86"}).then((doc) => {            
            const sticky = new Sticky({
                "title": req.body.title,
                "message": req.body.message,
                "restaurant": doc._id
            });
            sticky.save((err, result) => {
                if (err) {
                    return res.status(500).json({errors: err});
                }
                return res.status(200).json({
                        restaurant: result,
                        message: "Sticky Added Successfully"
                    });
            });
        }).catch(e => console.log(e));;

        
});

    // Update Sticky
router.patch('/sticky', [
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

    // Register User
    router.post('/user',[ 
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
            return res.status(501).json({errors: result});
        }

        const restaurant = new User({
            "username": req.body.username,
            "email": req.body.email,
            "password": req.body.password,
            "name": req.body.name,
            "address": req.body.address,
            "city": req.body.city,
            "state": req.body.state,
            "zipcode": req.body.zipcode,
            "phone": req.body.phone
        });
        restaurant.save((err, result) => {
            if (err) {
                return res.status(500).json({errors: err});
            }
            return res.status(200).json({restaurant: result});
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