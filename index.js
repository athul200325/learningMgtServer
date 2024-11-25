const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT 

const courseRoutes = require('./routes/courseRoute.js');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('DB Connection Error:', err));



app.use('/api/courses', courseRoutes);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
