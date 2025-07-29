import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Bot está online!');
});

app.listen(port, () => {
  console.log(`🌐 Web server rodando em http://localhost:${port}`);
});