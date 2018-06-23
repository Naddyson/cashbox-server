var express = require('express');
var router = express.Router();
var User = require('../models/User');


// GET route for reading data
router.get('/', function (req, res, next) {
    return res.sendFile(path.join(__dirname + '/templateLogReg/index.html'));
});


//POST route for updating data
router.post('/', function (req, res, next) {
    // confirm that user typed same password twice

    if (req.body.email &&
        req.body.username &&
        req.body.password) {

        var userData = {
            email: req.body.email,
            username: req.body.username.toLowerCase(),
            password: req.body.password,
            location: req.body.location
        }

        User.create(userData, function (error, user) {
            if (error) {
                return next(error);
            } else {
                req.session.userId = user._id;
                return res.send(user);
            }
        });

    } else if (req.body.logusername && req.body.logpassword) {
        console.log(req.body);
        User.authenticate(req.body.logusername.toLowerCase(), req.body.logpassword, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong username or password.');
                err.status = 401;
                return res.send(err);
            } else {
                req.session.userId = user._id;
                console.log('success')
                return res.send(user);
            }
        });
    } else {
        console.log(req.body)
        var err = new Error('All fields required.');
        err.status = 400;
        return next(err);
    }
})




// GET route after registering
router.get('/profile', function (req, res, next) {
    if (req.session.userId) {
        User.findById(req.session.userId)
            .exec(function (error, user) {
                if (error) {
                    return next(error);
                } else {
                    return res.json({name: user.name, email: user.email});
                }
            });
    } else {
        return res.send('You should to login ');
    }
});
router.get('/logout', function(req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function(err) {
            if(err) {
                return next(err);
            } else {
                return res.send('logouted');
            }
        });
    }
});

module.exports = router;