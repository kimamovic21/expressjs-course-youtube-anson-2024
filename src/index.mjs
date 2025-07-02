import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import routes from './routes/index.mjs';

const app = express();

app.use(express.json());
app.use(cookieParser('helloworld'));
app.use(session({
  secret: 'anson the dev',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7
  },
}));

app.use(routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});

app.get('/', (req, res) => {
  console.log(req.session);
  console.log(req.session.id);

  req.session.visited = true;

  res.cookie('hello', 'world', {
    maxAge: 60000 * 60,
    signed: true,
  });

  res.status(200).send({ msg: 'Hello World!' });
});