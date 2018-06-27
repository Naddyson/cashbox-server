var ObjectID = require('mongodb').ObjectID;
import WorkSession from '../models/WorkSession'
import User from '../models/User'
import mongoose from 'mongoose'
import moment from 'moment'


export default function (app, db) {
    app.get('/session/:id', (req,res) => {
        const id = req.params.id;
        const details = {'_id': ObjectID(id) };

        db.collection('WorkSession').findOne(details, (err, item) => {
            if(err){
                res.send({'error': 'Wrong session ID!'});

            } else {
                res.send(item);
            }
        });
    });
    app.post('/session', (req, res) => {
        console.log(req.body);
        let username = '';
        WorkSession.findById(ObjectID(req.body.workerID), (err, worker) => {
            username = worker.username;
        });
        if (req.body.workerID){
            var session = {
                workerID: req.body.workerID,
                username: username,
                startTime: new Date(),
                finishTime: null,
                cash: 0,
                history: []
            }
            WorkSession.create(session, function (error, session) {
                if (error) {
                    res.send(error);
                } else {
                    return res.send(session);
                }
            });

        } else {
            res.send({'error': 'Wrong Worker ID!'})
        }



    });

    app.put('/add-cash/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': ObjectID(id) };
        console.log(req.body)
        let cashChange = parseInt(req.body.cash);

        WorkSession.findById(ObjectID(id), (err, session) => {
            if (err) console.log(err);
            let newValue = session.cash + cashChange;
            session.cash = newValue;

            let newHistory =  {
                date: new Date(),
                cashChange: cashChange
            };
            session.history.push(newHistory);

            session.save( (err, updated) => {
                if (err) console.log(err);
                let response = {
                    earned: cashChange,
                    newHistory: newHistory
                }
                res.send(response)
            })
        });
        /*db.collection('WorkSession').update(details, {$inc: {cash: cashChange}}, (err, result) => {
            if (err) {
                res.send({'error': 'Something going wrong in add cash'});
            } else {
                console.log('Earned '+cashChange)
                response.earned = cashChange;
                let history = {
                    date: new Date(),
                    cashChange: cashChange
                };
                db.collection('WorkSession').update(details, {$push: {history: history}}, () => {
                    response.newHistory = history;
                    res.send(response);
                });


            }
        });*/



    });

    app.put('/session_end/:id', (req, res) => {
        const id = req.params.id;
        WorkSession.findById(ObjectID(id), (err, session) => {
            if (err) console.log(err);
            session.finishTime = new Date();

            session.save( (err, updated) => {
                if (err) console.log(err);
                res.send(updated)
            })
        });

    });
    app.post('/get-sessions/', (req, res) => {
        //year, month, day

        const date = req.body;

        let found = [];
        console.log(date)
        WorkSession.find({ })
            .exec( (err, sessions) => {
                sessions.forEach((ses) => {
                    if (
                        ses.startTime.getFullYear() === date.year &&
                        ses.startTime.getMonth() === date.month &&
                        ses.startTime.getDate() === date.day
                    ) {
                        console.log('push')
                        found.push(ses)
                    } else {
                        console.log(ses.startTime.getFullYear());
                        console.log(ses.startTime.getMonth());
                        console.log(ses.startTime.getDate());
                    }

                })
                res.send(found)
            });
    });
}
