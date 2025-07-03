import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import routes from './routes/index.mjs';
import './strategies/local-strategy.mjs';

const app = express();

mongoose
  .connect('mongodb://localhost:27017/express-tutorial-anson-yt-2024')
  .then(() => console.log('Connected to database'))
  .catch((err) => console.error(`Error: ${err}`));


app.use(express.json());
app.use(cookieParser('helloworld'));
app.use(session({
  secret: 'anson the dev',
  saveUninitialized: false,
  resave: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
  store: MongoStore.create({
    client: mongoose.connection.getClient(),
  })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});

app.post(
  '/api/auth',
  passport.authenticate('local'),
  (req, res) => {
    res.sendStatus(200);
  }
);

app.post('/api/auth/logout', (req, res) => {
  if (!req.user) return res.send(401);

  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.send(200);
  });
});

app.get('/api/auth/status', (req, res) => {
  console.log(`Inside auth/status endpoint`);
  console.log(req.user);
  console.log(req.session);
  console.log(req.sessionID);

  return req.user ? res.send(req.user) : res.sendStatus(401);
});