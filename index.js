const cors = require('cors');
const express = require('express');
const basicRouter = require('./routes/basicRouter');
const customerRouter = require('./routes/customerRouter');
const adminRouter = require('./routes/adminRouter');
const storeRouter = require('./routes/storeRouter');
const mongoose = require('mongoose');
const app = express();

const MongoDB_Path = "mongodb+srv://admin:deliveryfood@orderfood.cs59v.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

app.use(cors());
app.use(express.json());
app.use("/api", basicRouter);
app.use("/api", customerRouter);
app.use("/api", adminRouter);
app.use("/api", storeRouter);

mongoose
    .connect(MongoDB_Path)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((error) => console.error(error));

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`));