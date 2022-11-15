const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const route = require('./routes')

const app = express();

app.use(cors());
app.use(express.json());

route(app)

mongoose
    .connect(process.env.MONGODB_PATH)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error(error));

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));