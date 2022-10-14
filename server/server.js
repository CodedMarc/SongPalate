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
const hostURL = '';
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.json());
// app.use(express.static(path.join(__dirname, '../client/build')));


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
      profile.token = accessToken;
      profile.refresh = refreshToken;
      profile.expires = expires_in;
      console.log('FROM PASSPORT', profile);
      return done(null, profile);
      // User.findOrCreate({ spotifyId: profile.id, token: accessToken, spotify: profile }, function (err, user) {
        //   app.locals.tempUserVar = user;
        //   return done(null, user);
        // });
      }
      ));
      
app.use(cors({
  origin: 'https://songpalate.netlify.app',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));
app.use(sessions({
  secret: 'nom',
  resave: true,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
      
      
      
app.get('/', (req, res) => {
  return res.redirect('https://songpalate.netlify.app/')
})

app.get('/auth/spotify', passport.authenticate('spotify',
  {
    scope: ['streaming', 'user-read-email', 'user-read-private', 'user-library-read', 'user-library-modify', 'user-read-recently-played', 'user-top-read', 'playlist-read-private', 'playlist-modify-private', 'playlist-modify-public', 'user-modify-playback-state', 'user-read-playback-state'],
    showDialog: true
  })
);

app.get(
  '/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  ensureAuthenticated,
  function (req, res) {
    // return res.redirect('http://localhost:3001/spotifylog');
    // Successful authentication, redirect home.
    return res.redirect('https://songpalate.netlify.app/timeline/top');
  }
);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

app.get('/spotifylog', passport.authenticate('spotify', { failureRedirect: '/' }),
  ensureAuthenticated,
  (req, res) => {
    if (req.user) {
      return res.json(req.user);
    }
    return res.json({MessageFromMarc: 'no.'});
})

// app.get('*', (req, res) => {
//   console.log('Landed on page');
//   res.sendFile(path.join(__dirname, '../client/build/'));
// });

app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}
