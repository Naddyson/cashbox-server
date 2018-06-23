var ObjectID = require('mongodb').ObjectID;
import User from '../models/User'
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
        if (req.body.workerID){
            var session = {
                workerID: req.body.workerID,
                startTime: new Date(),
                finishTime: null,
                cash: 0,
                history: []
            }
            db.collection('WorkSession').insert(session, (err, result) => {
                if (err) {
                    res.send({'error': 'Something going wrong in session create'});
                } else {
                    console.log(result.ops[0])
                    res.send(result.ops[0]);
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
        console.log(cashChange);
        let response = {
            earned: 0,
            newHistory: {}
        }
        db.collection('WorkSession').update(details, {$inc: {cash: cashChange}}, (err, result) => {
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
        });



    });

    app.put('/session_end/:id', (req, res) => {
        const id = req.params.id;
        console.log(id)
        const details = {'_id': ObjectID(id) };
        db.collection('WorkSession').update(details, {$set: {finishTime: new Date()}}, (err, result) => {
            if (err) {
                res.send({'error': 'Something going wrong ($setfinishtime)'});
            } else {
                console.log(result);
                res.send(result);
            }
        });
    });
}
