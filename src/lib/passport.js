const passport= require('passport');
const LocalStrategy =require('passport-local').Strategy;

const pool= require('../database');
const helpers= require('../lib/helpers');

passport.use('local.signup', new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback: true
}, async(req, username, password, done)=>{
   console.log(req.body);
    const { fullname }=req.body;
    const newUser={
        fullname,
        username,
        password
        
    };
    newUser.password=await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id= result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser(async(id, done)=>{
    const rows= await pool.query('SELECT * FROM users Where id=?', [id]);
    done(null, rows[0]);
});
