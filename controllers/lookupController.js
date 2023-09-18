const BaseController = require('./baseController');
const { Op } = require('sequelize');

class LookupController extends BaseController {
  constructor(model, lkp_situpsModel, lkp_runningModel, tbl_userModel) {
    super(model);
    this.lkp_situpsModel = lkp_situpsModel;
    this.lkp_runningModel = lkp_runningModel;
    this.tbl_userModel = tbl_userModel;
  }

  async getTotalPoints(req, res) {
    const { age, pushup, situp, running } = req.query; //as part of the requested params
    const outputArray = []; //empty array to store all 3 points
    try {
      const pushUpPointsResult = await this.model.findOne({
        where: {
          age_group: age,
          performance: pushup,
        },
      });
      const sitUpPointsResult = await this.lkp_situpsModel.findOne({
        where: {
          age_group: age,
          performance: situp,
        },
      });
      const runningPointsResult = await this.lkp_runningModel.findOne({
        where: {
          age_group: age,
          performance: { [Op.gte]: running },
        },
      });

      // Extract the points from the results
      const pushUpPoints = pushUpPointsResult
        ? pushUpPointsResult.points
        : null;
      const sitUpPoints = sitUpPointsResult ? sitUpPointsResult.points : null;
      const runningPoints = runningPointsResult
        ? runningPointsResult.points
        : null;

      // Push the points into the output array
      outputArray.push(pushUpPoints, sitUpPoints, runningPoints);

      return res.json(outputArray);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async checkUser(req, res) {
    // Fetch user from request
    const { user } = req.body;

    // Check if user is available in database?
    const existingUser = await this.tbl_userModel.findOne({
      where: { email: user.email },
    });
    console.log(existingUser);
    if (existingUser) {
      // User is available, so ignore and return response
      return res.json(existingUser);
    } else {
      // User is not available in database and new user, so we will add into database
      const newUser = await this.tbl_userModel.create({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        birthday: user.birthday,
      });
      return res.json(newUser);
    }
  }
}

module.exports = LookupController;
