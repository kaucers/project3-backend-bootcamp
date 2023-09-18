const cors = require('cors')
const express = require('express')
require('dotenv').config()


// importing Routers
const IpptsRouter = require('./routers/ipptsRouter')
const AchievementRouter = require('./routers/achievementRouter')

// importing Controllers
const IpptsController = require('./controllers/lookupController')
const AchievementsController = require('./controllers/achievementController')

// importing DB (Self-Note: No S here)
const db = require('./db/models/index')
const {lkp_pushup,lkp_situps,lkp_running, tbl_users,tbl_target_pefs,tbl_current_pefs,tbl_achieves} = db;
// console.log(`lkp_pushup: ${lkp_pushup}`)
// console.log(`tbl_target_pef: ${tbl_target_pefs}`)

// s sensitive (db sensitive names)
// initializing Controllers -> note the lowercase for the first word
const ipptsController = new IpptsController(lkp_pushup,lkp_situps,lkp_running,tbl_users,tbl_target_pefs,tbl_current_pefs,tbl_achieves)
const achievementsController = new AchievementsController(tbl_achieves)

// inittializing Routers
const ipptController = new IpptsRouter(ipptsController).routes()
const achievementController = new AchievementRouter(achievementsController).routes()

const PORT = process.env.PORT;
const app = express();
// middelvare to send fake request using thunder client 
app.use(express.json());

// Enable CORS access to this server
app.use(cors());

// using the routers
app.use('/', ipptController) //generic
app.use('/achievement',achievementController) //achievement only

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});