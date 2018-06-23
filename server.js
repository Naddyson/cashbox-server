import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from './app/routes'
import user_routes from './app/routes/user_routes'

var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);


const app = express();
const port = 3001;


app.use(cors()) //cross origin request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


mongoose.connect('mongodb://naddyson:userbb4eed@ds155191.mlab.com:55191/magic-cashbox', {useMongoClient: true})
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(session({
    secret: 'stairway spin - money in',
    resave: false,
    saveUninitialized: false,
    // Место хранения можно выбрать из множества вариантов, это и БД и файлы и Memcached.
    store: new MongoStore({
        url: 'mongodb://naddyson:userbb4eed@ds155191.mlab.com:55191/magic-cashbox',
    })
}))


app.use('/auth', user_routes);
routes(app, db);








// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('File Not Found');
    err.status = 404;
    next(err);
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app listening on port '+ port);
});
// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});



