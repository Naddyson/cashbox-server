var mongoose = require('mongoose')
var crypto = require('crypto')
var User = require('./models/User.js')
var db = mongoose.connect('mongodb://naddyson:userbb4eed@ds155191.mlab.com:55191/magic-cashbox')

// User API

exports.createUser = function(userData){
    var user = {
        email: userData.email,
        username: userData.name,
        password: hash(userData.password),
        passwordConf: hash(userData.password)
    }
    console.log(User)
    return new User(user).save()
}

exports.getUser = function(id) {
    return User.findOne(id)
}

exports.checkUser = function(userData) {
    return User
        .findOne({email: userData.email})
        .then(function(doc){
            if ( doc.password == hash(userData.password) ){
                console.log("User password is ok");
                return Promise.resolve(doc)
            } else {
                return Promise.reject("Error wrong")
            }
        })
}

function hash(text) {
    return crypto.createHash('sha1')
        .update(text).digest('base64')
}