const BaseController = require("./baseController");
const { Op } = require("sequelize");

class LookupController extends BaseController {
  constructor( model,lkp_situpsModel,lkp_runningModel, tbl_usersModel,tbl_target_pefModel,tbl_current_perfModel) {
    super(model)
    this.lkp_situpsModel = lkp_situpsModel; //newmodel adds here
    this.lkp_runningModel = lkp_runningModel;
    this.tbl_usersModel = tbl_usersModel;
    this.tbl_target_pefModel = tbl_target_pefModel;
    this.tbl_current_perfModel = tbl_current_perfModel;
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
      outputArray.push(sitUpPoints,pushUpPoints, runningPoints);
      
      return res.json(outputArray);
    }catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  
   // Create retrieve target performance data for a given user
    async findUserHistory(req, res) {
      const { email } = req.query;
      console.log(`Search Query: ${JSON.stringify(email)}`)
      
      try {
        // Find the user whose first name matches the search query
        const user = await this.tbl_usersModel.findOne({
          where: { email: email },
        });

        if (!user) {
          // Handle the case where the user is not found
          return res.status(404).json({ error: true, msg: 'User not found' });
        }

        // Use the association to retrieve the user's associated target performance data
        const currentPerformances = await user.getTbl_current_pefs();

        // Respond with the target performance data for the user
        return res.json(currentPerformances);
      } catch (err) {
        // Handle any errors that occur during the process
        return res.status(500).json({ error: true, msg: 'Internal server error' });
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


  // Create new user
  async insertUser(req, res) {
    console.log(`POST: ${JSON.stringify(req.body)}`)
    const { first_name, last_name, email, birthday} = req.body;
    
    try {
      // Create new sighting
      const [newUser,created]= await this.tbl_usersModel.findOrCreate ({
        where: { email: email },
        defaults:{
          first_name: first_name,
          last_name: last_name,
          email: email,
          birthday: new Date(birthday)
        }
      });
      // Respond with newuser
      if (created){
        console.log("New User Created!")
      }
      return res.json(newUser);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }


  // Create updateUserByEmail
  async updateUserByEmail(req, res) {
    const { first_name, last_name, email, birthday } = req.body;

    try {
      // Find the user by email
      const existingUser = await this.tbl_usersModel.findOne({
        where: { email: email },
      });

      if (existingUser) {
        // User exists, update their information
        const updatedUser = await existingUser.update({
          first_name: first_name,
          last_name: last_name,
          birthday: new Date(birthday),
        });

        console.log("User Updated!");
        return res.json(updatedUser);
      } else {
        // User does not exist, return an error
        return res.status(404).json({ error: true, msg: "User not found" });
      }
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Create retrieve all the target performance set by a given user
  async findUserTargets (req, res) {
  // Find all users with their associated tasks
  // Raw SQL: Eager Loading: SELECT * FROM "Users" JOIN "Tasks" ON "Tasks"."userId" = "Users".id;
  const { email } = req.query;
  console.log(`POST: ${JSON.stringify(email)}`)
  try {
    // Find all users named John with their associated tasks
    const user = await this.tbl_usersModel.findOne({
      where: { email: email },
      include: {
          model: this.tbl_target_pefModel //association
      }
  });
  
    // Respond with new sighting
    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// Create updateTargetByEmail
async updateUserTarget(req, res) {
  const { push_up, sit_up, run, end_date, user_id } = req.body;

  try {
    // Find the user by user_id
    const existingUser = await this.tbl_usersModel.findOne({
      where: { id: user_id },
    });

    if (existingUser) {
      // Assuming you have a target performance record associated with the user
      const targetPerformance = await existingUser.getTbl_target_pefs();

      if (targetPerformance) {
        // Update the target performance values
        await targetPerformance[0].update({
          push_up: push_up,
          sit_up: sit_up,
          run: run,
          end_date: end_date,
        });
        
        return res.status(200).json({ success: true, msg: 'Target performance updated successfully.' });
      } else {
        // Target performance record does not exist, return an error
        return res.status(404).json({ error: true, msg: 'Target performance record not found for the user.' });
      }
    } else {
      // User does not exist, return an error
      return res.status(404).json({ error: true, msg: 'User not found.' });
    }
  } catch (err) {
    return res.status(500).json({ error: true, msg: 'Internal server error.' });
  }
}
  
// Create updateTargetByEmail
async insertUserDaily(req, res) {
  const { sit_up, push_up, run, user_id } = req.body;

  try {
    // Find the user by user_id
    const existingUser = await this.tbl_usersModel.findOne({
      where: { id: user_id },
    });

    if (existingUser) {
      // Check if there is an existing entry for the current day
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // Find or create the current performance record for the given date
      let [currentPerformance, created] = await this.tbl_current_perfModel.findOrCreate({
        where: {
          user_id: user_id,
          date: today,
        },
        defaults: {
          push_up: push_up,
          sit_up: sit_up,
          run: run,
          date: today,
          user_id: user_id,
        },
      });

      if (!created) {
        // Update the existing current performance values
        await currentPerformance.update({
          push_up: push_up,
          sit_up: sit_up,
          run: run,
        });
      }

      return res.status(200).json({ success: true, msg: 'Target performance updated successfully.' });
    } else {
      // User does not exist, return an error
      return res.status(404).json({ error: true, msg: 'User not found.' });
    }
  } catch (err) {
    return res.status(500).json({ error: true, msg: 'Internal server error.' });
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
