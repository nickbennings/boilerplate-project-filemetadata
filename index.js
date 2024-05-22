const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res) => {
  res.sendFile(`${process.cwd()}/views/index.html`);
});

const upload = multer().single('upfile');

app.post('/api/fileanalyse', upload, (req, res) => {
  const { originalname, mimetype, size } = req.file;
  const responseObject = {
    name: originalname,
    type: mimetype,
    size: size
  };

  res.json(responseObject);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Your app is listening on port ${PORT}`);
});