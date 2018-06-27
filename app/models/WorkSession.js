import mongoose from "mongoose";

const Schema = mongoose.Schema;

const WorkSessionSchema = new Schema({
    workerID     : { type: String, required: true },
    startTime      : { type: Date, required: true },
    finishTime     : { type: Date },
    cash : { type: Number, required: true },
    history: [],
    /* photo: { type: Buffer }*/
});

var WorkSession = mongoose.model('WorkSession', WorkSessionSchema);
module.exports = WorkSession;