import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.status(200).send({ msg: 'Hello World!' });
});

app.get('/api/users', (req, res) => {
  res.send([
    { id: 1, username: 'James' },
    { id: 2, username: 'John ' }, 
    { id: 3, username: 'Robert' }, 
  ]);
});

app.get('/api/products', (req, res) => {
  res.send([
    { id: 1, name: 'Product 1', price: 9.90 },
    { id: 2, name: 'Product 2', price: 10.90 },
    { id: 3, name: 'Product 3', price: 11.90 },
  ]);
});

app.listen(PORT, () => {
  console.log(`Running on port: ${PORT}`);
});