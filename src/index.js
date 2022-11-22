const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const db = require('./config/dbConfig')
const route = require('./api/routes')
const errorHandler = require('./api/middlewares/errorHandler')

const app = express();
db.connect(process.env.MONGO_URI)
const port = process.env.PORT || 3000

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use(morgan('tiny'))

route(app)
errorHandler(app)

app.listen(port, () => console.log(`Listening on port ${port}...`));