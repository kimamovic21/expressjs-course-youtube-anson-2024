import { mockUsers } from './utils/constants.mjs';

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
  console.log(req.session.id);

  req.session.visited = true;

  res.cookie('hello', 'world', {
    maxAge: 60000 * 60,
    signed: true,
  });

  res.status(200).send({ msg: 'Hello World!' });
});

app.post('/api/auth', (req, res) => {
  const { body: { username, password } } = req;

  const findUser = mockUsers.find(user => user.username === username);

  if (!findUser || findUser.password !== password) {
    return res.status(401).send({ msg: 'Bad credentials' });
  };

  req.session.user = findUser;

  return res.status(200).send(findUser);
});

app.get('/api/auth/status', (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log(session);
  });

  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: 'Not authenticated' });
});

app.post('/api/cart', (req, res) => {
  if (!req.session.user) return res.sendStatus(401);

  const { body: item } = req;

  const { cart } = req.session;

  if (cart) {
    cart.push(item)
  } else {
    req.session.cart = [item];
  };

  return res.status(201).send(item);
});

app.get('/api/cart', (req, res) => {
  if (!req.session.user) return res.sendStatus(401);

  return res.send(req.session.cart ?? []);
}); 