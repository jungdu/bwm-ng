const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/dev');

exports.auth = function(req,res){
    const {email, password} = req.body;
    
    if(!password || !email){
        return res.status(422).send({errors: {title: 'Data missing', detail: 'Provide email and passwrod!'}});
    }
    
    User.findOne({email}, function(err, user){
        if(err){
            return res.status(422).send({errors: {title: 'Mongoose Error'}});
        }
        if(!user){
            return res.status(422).send({errors: {title: 'invalid user', detail: 'User does not exist'}});
        }
        
        if(user.isSamePassword(password)){
            const token = jwt.sign({
                userId : user.id,
                username: user.username
            }, config.SECRET, {expiresIn: '1h'});
            console.log(token);
        return res.json(token);
    }else{
        return res.status(422).send({errors: {title: 'Wrong Data', detail: 'Wrong email or password'}});
    }
});
}

exports.register = function(req, res){
    //const username = req.body.username;
    // const email = req.body.email;
    // const password = req.body.password;
    // const passwordConfirmation = req.body.passwordConfirmation;
    
    const {username, email, password, passwordConfirmation} =req.body;
    if(!password || !email){
        return res.status(422).send({errors: {title: 'Data missing', detail: 'Provide email and passwrod!'}});
    }
    if(password !== passwordConfirmation){
        return res.status(422).send({errors: {title: 'Confirm your password', detail: 'Provide email and passwrod!'}});
    }
    
    User.findOne({email}, function(err, existingUser){
        if(err){
            console.log(err);
            return res.status(422).send({errors: {title: 'Mongoose Error'}});
        }
        
        if(existingUser){
            return res.status(422).send({errors: {title: 'Invalid email', detail: 'User with this email already exist!'}});
        }
        
        const user = new User({
            username,
            email,
            password
        });
        
        user.save(function(err){
            if(err){
                console.log(err);
                return res.status(422).send({errors: {title: 'Mongoose Error'}});
            }
            
            return res.json({status: 500,'register': true});
        })
    });
}

exports.authMiddleware = function(req, res ,next){
    const token = req.headers.authorization;
    console.log("req.header.authorization : "+token);
    
    if(token){
        const user = parseToken(token);

        User.findById(user.userId, function(err, user){
            if(err){
                return res.status(422).send({errors: {title: 'Mongoose Error'}});
            }else{
                if(user){
                    res.locals.user = user;
                    next();
                }else{
                    return res.status(422).send({errors: {title: 'Not authorized', detail: 'You need to login to get access'}});            
                }
            }
        });
    }else{
        return res.status(422).send({errors: {title: 'Not authorized', detail: 'You need to login to get access'}});
    }
}

function parseToken(token){
    return jwt.verify(token.split(' ')[1], config.SECRET);
}