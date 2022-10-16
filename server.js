require('dotenv').config();
const User = require('./UserSchema');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
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
const hostURL = '';
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });


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
      callbackURL: 'https://songpalate.herokuapp.com/callback'
    },
    function (accessToken, refreshToken, expires_in, profile, done) {
      // profile.token = accessToken;
      // profile.refresh = refreshToken;
      // profile.expires = expires_in;

      // return done(null, profile);
      const newUser = {
        name: profile.displayName,
        spotifyId: profile.id,
        profile: profile,
        token: accessToken,
        username: profile.username,
        email: profile.emails[0].value,
        refresh: refreshToken
      }
      User.findOne({ spotifyId: profile.id }, function (err, user) {
        if (user) {
          if (user.token !== accessToken) {
            User.findOneAndUpdate({spotifyId: user.spotifyId, token: user.token}, {token: accessToken}, (err, updated) => {
              return done(null, updated);
            })
          }
          return done(null, user);
        }
        else {
          User.create(newUser, (err, createdUser) => {
            return done(null, createdUser);
          })
        }
      });
    }
  )
);
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors());
app.use(sessions({
  secret: process.env.COOKIE_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true, sameSite: 'none'},
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, '/client/build')));

app.get('/auth/spotify', passport.authenticate('spotify',
  {
    scope: ['streaming', 'user-read-email', 'user-read-private', 'user-library-read', 'user-library-modify', 'user-read-recently-played', 'user-top-read', 'playlist-read-private', 'playlist-modify-private', 'playlist-modify-public', 'user-modify-playback-state', 'user-read-playback-state'],
    showDialog: true
  }));
app.get(
  '/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  ensureAuthenticated,
  function (req, res) {
    res.cookie('nomnom', req.user._id, {
      expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 365)),
      signed: true,
      httpOnly: true,
      secure: true
    });
    console.log('redirecting', req.user._id)
    // Successful authentication, redirect home.
    // return res.redirect(`/timeline/top`);
    return res.redirect('https://songpalate.herokuapp.com/timeline/top');
  }
);

app.get('/spotifylog', (req, res) => {
  const magicId = req.signedCookies['nomnom'];
  User.findOne({_id: magicId}, (err, user) => {
    return res.json(user);
  })
})


app.get('*', (req, res) => {
  console.log('Landed on page');
  res.sendFile(path.join(__dirname, '/client/build/'));
});

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}