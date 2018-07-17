const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    startAt: {type:Date, required: 'Starting date is required'},
    endAt: {type:Date, required: 'Starting date is required'},
    totalPrice: Number,
    guests: Number,
    guests: Number,
    createdAt: {type:Date, defulat: Date.now},
    user: {type:Schema.Types.ObjectId, ref:'User'},
    rental: {type: Schema.Types.ObjectId, ref: 'Rental'}
});

module.exports = mongoose.model('Booking', bookingSchema);