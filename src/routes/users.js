const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/User')

router.get('/users/signin', (req, res) => {
    res.render('users/signin')
})

router.get('/users/signup', (req, res) => {
    res.render('users/signup')
});

router.post('/users/signup', async (req, res) => {
    const {name, email, password, confirm_password}= req.body;
    const errors = [];

    if(name.length <= 0) {
        errors.push({text:'Please enter your name'});
    }
    if(!email) {
        errors.push({text:'Please place a valid email'});
    }
    if(password.length < 8 && password.length > 0) {
        errors.push({text:'Your password must have a minimum of 8 characters.'});
    }
    if(password != confirm_password) {
        errors.push({text:'Both passwords must match.'});
    }    
    if(errors.length > 0) {
        res.render('users/signup', { errors, name, email, password, confirm_password});
    }else{
        const emailUser = await User.findOne({email: email});
        if(emailUser){
            req.flash('error_msg','This email already exist.');
            res.redirect('/users/signup');
        }else{
            const newUser = new User({name, email, password});
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'You have been registered!');
            res.redirect('/users/signin');
        }
    }
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect:'/notes',
    failureRedirect:'/users/signin',
    failureFlash: true
}));

router.get('/users/logout', (req, res, next) => {
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        res.redirect('/');
    });
});

module.exports = router;