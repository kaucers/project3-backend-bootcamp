const BaseController = require("./baseController");
const { Op } = require("sequelize");

class LookupController extends BaseController {
  constructor( model,lkp_situpsModel,lkp_runningModel) {
    super(model)
    this.lkp_situpsModel = lkp_situpsModel; //newmodel adds here
    this.lkp_runningModel = lkp_runningModel;
  }

  // Retrieve specific sighting
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
          performance: {[Op.gte]: running},
        },
      });

      // Extract the points from the results
      const pushUpPoints = pushUpPointsResult ? pushUpPointsResult.points : null;
      const sitUpPoints = sitUpPointsResult ? sitUpPointsResult.points : null;
      const runningPoints = runningPointsResult ? runningPointsResult.points : null;

      // Push the points into the output array
      outputArray.push(pushUpPoints, sitUpPoints, runningPoints);
      
      return res.json(outputArray);
    }catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
  
  // async getPushUpPoints(req, res) {
  //   const { age, situp} = req.body; //as part of the requested params
    
  //   try {
  //     const pushUpPoints = await this.model.findOne({
  //       where: {
  //         age_group: age,
  //         performance: situp,
  //       },
  //     });
  //     return res.json(pushUpPoints.points);
  //   }catch (err) {
  //     return res.status(400).json({ error: true, msg: err });
  //   }
  // }

  


  // Create sighting
  async insertOne(req, res) {
    console.log(`POST: ${JSON.stringify(req.body)}`)
    const { date, location, notes } = req.body;
    
    try {
      // Create new sighting
      const newSighting = await this.model.create({
        date: new Date(date),
        location: location,
        notes: notes,
      });
      // Respond with new sighting
      return res.json(newSighting);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Edit  sighting
  async editOne(req, res) {
    // To get data from the user
    const id = req.params.sightingId; //get the product id
    console.log(`ID TO BE EDITED: ${id}`)
    console.log(`POST: ${JSON.stringify(req.body)}`)
    const {date, location, notes, city, country } = req.body; //get from form
    
    try {
      // Edit sighting
      const editSighting = await this.model.update({
        date: new Date(date),
        location: location,
        notes: notes,
        city: city,
        country: country,
      }, {
        where:{
          id: id //Find the id of interest from user req
        }
      });
      // Respond with new sighting
      return res.json(editSighting);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Retrieve all comments for specific sighting
  async getComments(req, res) {
    const { sightingId } = req.params;
    try {
      const comments = await this.commentModel.findAll({
        where: {
          sightingId: sightingId,
        },
      });
      return res.json(comments);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

   // Create commWent for specific sighting
  async insertOneComment(req, res) {
    const { sightingId } = req.params;
    const { content } = req.body;
    try {
      const newComment = await this.commentModel.create({
        content: content,
        sightingId: sightingId,
      });
      return res.json(newComment);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  
  
}

module.exports = LookupController;
