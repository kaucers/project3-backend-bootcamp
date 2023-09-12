const cors = require('cors');
const express = require('express');
require('dotenv').config();

// importing Routers
const IpptsRouter = require('./routers/ipptsRouter');

// importing Controllers
const IpptsController = require('./controllers/lookupController');

// importing DB
const db = require('./db/models/index');
const { lkp_pushup, lkp_situps, lkp_running, tbl_users } = db;
// console.log(`lkp_pushup: ${lkp_pushup}`)
// console.log(`lkp_situps: ${lkp_situps}`)

// initializing Controllers -> note the lowercase for the first word
const ipptsController = new IpptsController(
  lkp_pushup,
  lkp_situps,
  lkp_running,
  tbl_users
);

// inittializing Routers
const ipptController = new IpptsRouter(ipptsController).routes();

const PORT = process.env.PORT;
const app = express();
// middelvare to send fake request using thunder client
app.use(express.json());

// Enable CORS access to this server
app.use(cors());

// using the routers
app.use('/', ipptController);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
