import express from 'express';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: 'james', displayName: 'James' },
  { id: 2, username: 'john ', displayName: 'John' },
  { id: 3, username: 'robert', displayName: 'Robert' },
  { id: 4, username: 'anson', displayName: 'Anson' },
  { id: 5, username: 'kerim', displayName: 'Kerim' },
];

const mockProducts = [
  { id: 1, name: 'Product 1', price: 9.90 },
  { id: 2, name: 'Product 2', price: 10.90 },
  { id: 3, name: 'Product 3', price: 11.90 },
];

app.get('/', (req, res) => {
  res.status(200).send({ msg: 'Hello World!' });
});

app.get('/api/users', (req, res) => {
  console.log(req.query);
  const { query: { filter, value } } = req;

  if (!filter && !value) return res.send(mockUsers);

  if (filter && value) return res.send(
    mockUsers.filter((user) => user[filter].includes(value))
  );

  return res.send(mockUsers);
});

app.get('/api/users/:id', (req, res) => {
  console.log(req.params);

  const parsedId = parseInt(req.params.id);
  console.log(parsedId);

  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: 'Bad request. Invalid Id.' });
  };

  const findUser = mockUsers.find((user) => user.id === parsedId);
  if (!findUser) {
    return res.status(400).sendStatus(404);
  };

  return res.send(findUser);
});

app.post('/api/users', (req, res) => {
  console.log(req.body);

  const { body } = req;

  const newUser = {
    id: mockUsers[mockUsers.length - 1].id + 1,
    ...body
  };

  mockUsers.push(newUser);

  return res.status(201).send(newUser);
});

app.put('/api/users/:id', (req, res) => {
  console.log(req.params);

  const { body, params: { id } } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.sendStatus(400);
  };

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) {
    return res.status(404).send({ msg: 'User not found.' })
  };

  mockUsers[findUserIndex] = {
    id: parsedId,
    ...body
  };

  return res.sendStatus(200);
});

app.patch('/api/users/:id', (req, res) => {
  console.log(req.params);

  const { body, params: { id } } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.sendStatus(400);
  };

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) {
    return res.status(404).send({ msg: 'User not found.' })
  };

  mockUsers[findUserIndex] = {
    ...mockUsers[findUserIndex],
    ...body
  };

  return res.sendStatus(200);
});

app.delete('/api/users/:id', (req, res) => {
  console.log(req.params);

  const { params: { id } } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) {
    return res.sendStatus(400);
  };

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) {
    return res.status(404).send({ msg: 'User not found.' })
  };

  mockUsers.splice(findUserIndex, 1);

  return res.sendStatus(200);
});

app.get('/api/products', (req, res) => {
  res.send(mockProducts);
});

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});