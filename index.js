const cors = require('cors')
const express = require('express')
require('dotenv').config()


/////////////////////////////////////
//importing middleware - START
/////////////////////////////////////
const { auth } = require('express-oauth2-jwt-bearer');

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
  });


  
/////////////////////////////////////
//importing middleware - END
/////////////////////////////////////

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
const ipptController = new IpptsRouter(ipptsController,checkJwt).routes()
const achievementController = new AchievementRouter(achievementsController,checkJwt).routes()

const PORT = process.env.PORT;
const app = express();

// middleware to send fake request using thunder client 
app.use(express.json());

// Enable CORS access to this server
app.use(cors());

// enforce on all endpoints
app.use(checkJwt);
app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});

// using the routers
app.use('/', ipptController) //generic
app.use('/achievement',achievementController) //achievement only

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});