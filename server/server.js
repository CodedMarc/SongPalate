require('dotenv').config();
const User = require('./UserSchema');
const mongoose = require('mongoose');
const express = require('express');
const sessions = require('express-session');
const passport = require('passport');
const cors = require('cors');
const SpotifyStrategy = require('passport-spotify').Strategy;
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');

const client_id = process.env.client_id;
const client_secret = process.env.client_secret;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(cors());
app.use(sessions({
  secret: 'shh',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true },
}));
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new SpotifyStrategy(
    {
      clientID: client_id,
      clientSecret: client_secret,
      callbackURL: '/callback'
    },
    function (accessToken, refreshToken, expires_in, profile, done) {
      User.findOrCreate({ spotifyId: profile.id, token: accessToken, spotify: profile }, function (err, user) {
        app.locals.spuser = user;
        return done(err, user);
      });
    }
  )
);

app.get('/auth/spotify', passport.authenticate('spotify',
  {
    scope: ['streaming', 'user-read-email', 'user-read-private', 'user-library-read', 'user-library-modify', 'user-read-recently-played', 'user-top-read', 'playlist-read-private', 'playlist-modify-private', 'playlist-modify-public', 'user-modify-playback-state', 'user-read-playback-state'],
    showDialog: true
  }));
app.get(
  '/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:3001/timeline/top');
  }
);

app.get('/spuser', (req, res) => {
  console.log('pinged for ', app.locals.spuser);
  return res.json(app.locals.spuser);
})

app.get('*', (req, res) => {
  console.log('Landed on page');
  res.sendFile(path.join(__dirname, '../client/build/'));
});

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
})