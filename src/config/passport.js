const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new LocalStrategy({ 
    userNameField: 'email',
}, async (username, password, done) => {
    const user = await User.findOne({email: username});
    if(!user){
        return done(null, false, {message: 'No user found.'});
    }else {
        const match = await user.matchPassword(password);
        if(match){
            return done(null, user);
        }else{
            return done(null, false, {message: 'Incorrect password.'});
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user)=> {
        done(err, user)
    })
})