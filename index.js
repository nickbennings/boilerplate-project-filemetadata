const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', multer().single('upfile'), (req, res) => {
  const responseObject = {
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  };

  res.json(responseObject);
});

app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
