const Booking = require('../models/booking');
const Rental = require('../models/rental');
const User = require('../models/user');
const moment = require('moment');
exports.createBooking = function(req, res){

    const {startAt, endAt, totalPrice, guests, days, rental} = req.body;
    const user = res.locals.user;

    const booking = new Booking({startAt, endAt, totalPrice, guests, days});

    Rental.findById(rental._id)
        .populate('bookings')
        .populate('user')
        .exec(function(err, foundRental){
            if(err){
                return res.status(422).send({errors: 'booking error'});
            }
            if(foundRental){
                if(foundRental.user){
                    if(foundRental.user.id === user.id){
                        return res.status(422).send({errors: [{title:'Invalid user!', detail: 'Cannot create booking on your rental'}]});
                    }
                }else{
                    console.log("none founded rental.user");
                }
            }else{
                console.log("none foundedRental");
            }

            if(isValidBooking(booking, foundRental)){
                booking.user = user;
                booking.rental = foundRental;
                foundRental.bookings.push(booking);
                booking.save(function(err){
                    if(err){
                        return res.status(422).send({errors:'error in booking save'})
                    }
                    foundRental.save();                    
                    User.update({_id: user.id}, {$push: {bookings: booking}}, function(){
                        console.log('added succesfully');
                    });
                });
                return res.json({startAt:booking.startAt, endAt: booking.endAt});
            }else{
                return res.status(422).send({errors: [{title: 'invalid Booking!', detail: "Choosen date are already booking"}]})
            }
        });
}

function isValidBooking(proposedBooking, rental){
    let isValid = true;
    if(rental.bookings && rental.bookings.length > 0){
        isValid = rental.bookings.every(function(booking){
            const proposedStart = moment(proposedBooking.startAt);
            const proposedEnd = moment(proposedBooking.endAt);
            const actualStart = moment(booking.startAt);
            const actualEnd = moment(booking.endAt);

            return (actualStart < proposedStart && actualEnd < proposedStart) || (actualStart > proposedEnd && actualEnd > proposedEnd);
        });
    }
    return isValid;
}