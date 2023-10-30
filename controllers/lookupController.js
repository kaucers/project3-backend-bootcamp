const BaseController = require('./baseController');
const { Op } = require('sequelize');

class LookupController extends BaseController {
  constructor(
    model,
    lkp_situpsModel,
    lkp_runningModel,
    tbl_usersModel,
    tbl_target_pefModel,
    tbl_current_perfModel,
    tbl_achieve_Model
  ) {
    super(model);
    this.lkp_situpsModel = lkp_situpsModel; //newmodel adds here
    this.lkp_runningModel = lkp_runningModel;
    this.tbl_usersModel = tbl_usersModel;
    this.tbl_target_pefModel = tbl_target_pefModel;
    this.tbl_current_perfModel = tbl_current_perfModel;
    this.tbl_achieve_Model = tbl_achieve_Model;
  }

  async getTotalPoints(req, res) {
    const { age, pushup, situp, running } = req.query; //as part of the requested params
    const outputArray = []; //empty array to store all 3 points
    try {
      const pushUpPointsResult = await this.model.findOne({
        where: {
          age_group: age || null,
          performance: pushup || null,
        },
      });
      const sitUpPointsResult = await this.lkp_situpsModel.findOne({
        where: {
          age_group: age || null,
          performance: situp || null,
        },
      });
      const runningPointsResult = await this.lkp_runningModel.findOne({
        where: {
          age_group: age || null,
          performance: { [Op.gte]: running || null },
        },
      });

      // Extract the points from the results
      const pushUpPoints = pushUpPointsResult
        ? pushUpPointsResult.points
        : null;
      const pushUpPoints = pushUpPointsResult
        ? pushUpPointsResult.points
        : null;
      const sitUpPoints = sitUpPointsResult ? sitUpPointsResult.points : null;
      const runningPoints = runningPointsResult
        ? runningPointsResult.points
        : null;
      const runningPoints = runningPointsResult
        ? runningPointsResult.points
        : null;

      // Push the points into the output array
      outputArray.push(sitUpPoints, pushUpPoints, runningPoints);

      return res.json(outputArray);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  // Create retrieve target performance data for a given user
  async findUserHistory(req, res) {
    const { email } = req.query;
    console.log(`Search Query: ${JSON.stringify(email)}`);
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
      return res
        .status(500)
        .json({ error: true, msg: 'Internal server error' });
    }
  }

  // Create retrieve target performance data for a given user
  async findUserAchievements(req, res) {
    const { email } = req.query;
    console.log(`Search Query: ${JSON.stringify(email)}`);
    // To get information on backend performance then track to return
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
      const currentAchievements = await user.getTbl_achieves;
      //Functions to process:

      // Respond with the target performance data for the user
      return res.json(currentAchievements);
    } catch (err) {
      // Handle any errors that occur during the process
      return res
        .status(500)
        .json({ error: true, msg: 'Internal server error' });
    }
  }

  // Query Page: Get user achievements
  async getUserAchievements(req, res) {
    const { email } = req.query;
    this.tbl_usersModel
      .findOne({
        where: { email: email },
        include: [
          {
            model: this.tbl_achieve_Model,
            attributes: ['achievement'],
          },
        ],
      })
      .then((user) => {
        if (!user) {
          throw new Error('User not found');
        }

        // Access the associated achievements using the correct getter method
        const achievements = user.tbl_achieves.map(
          (achievementObj) => achievementObj.achievement
        );

        // Extract the achievement names from the results
        console.log(`User's achievements: ${user}`);
        return res.json(achievements);
      })
      .catch((error) => {
        console.error('Error retrieving user achievements:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  }

  // Reponsive App Bar: Create retrieve target performance data for a given user then submit to server
  async addUserAchievements(req, res) {
    const { email } = req.query;
    console.log(`Search Query: ${JSON.stringify(email)}`);
    // To get information on backend performance then track to return
    try {
      // Find the user whose first name matches the search query
      const user = await this.tbl_usersModel.findOne({
        where: { email: email },
      });

      if (!user) {
        // Handle the case where the user is not found
        return res.status(404).json({ error: true, msg: 'User not found' });
      }

      const consecutiveDaysOfEntry = (jsonData, count) => {
        // Sort the JSON data by date in ascending order
        jsonData.sort((a, b) => new Date(a.date) - new Date(b.date));

        // Function to check if two dates are consecutive days
        const areConsecutiveDays = (date1, date2) => {
          const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
          const firstDate = new Date(date1);
          const secondDate = new Date(date2);
          const diffInDays = Math.abs((firstDate - secondDate) / oneDay);
          return diffInDays === 1;
        };

        let consecutiveDaysCount = 0;

        for (let i = 0; i < jsonData.length - 1; i++) {
          const currentDate = jsonData[i].date;
          const nextDate = jsonData[i + 1].date;

          if (areConsecutiveDays(currentDate, nextDate)) {
            consecutiveDaysCount++;
            if (consecutiveDaysCount === count) {
              // If there are 4 consecutive days, the next day makes it 5 consecutive days
              return true; // Found 5 consecutive days
            }
          } else {
            // Reset the count if there is a gap in dates
            consecutiveDaysCount = 0;
          }
        }

        // If no 5 consecutive days were found, return false
        return false;
      };

      // Use the association to retrieve the user's associated target performance data
      const currentPerformances = await user.getTbl_current_pefs();
      // If true, add user into junction table
      if (consecutiveDaysOfEntry(currentPerformances, 4)) {
        this.tbl_achieve_Model
          .findOne({ where: { achievement: 'discipline maestro' } })
          .then((achievement) => {
            if (!achievement) {
              throw new Error('Achievement not found');
            }
            // Use the `addAchievement` method to create the association
            return user.addTbl_achieves(achievement);
          })
          .then(() => {
            console.log('User and achievement related successfully');
          })
          .catch((error) => {
            console.error('Error creating user achievement entry:', error);
          });
      }

      // Respond with the target performance data for the user
      return res.json(consecutiveDaysOfEntry(currentPerformances, 4));
    } catch (err) {
      // Handle any errors that occur during the process
      return res
        .status(500)
        .json({ error: true, msg: 'Internal server error' });
    }
  }

  async checkUser(req, res) {
    // Fetch user from request
    const { user } = req.body;

    // Check if user is available in database?
    const existingUser = await this.tbl_usersModel.findOne({
      where: { email: user.email },
    });
    console.log(existingUser);
    if (existingUser) {
      // User is available, so ignore and return response
      return res.json(existingUser);
    } else {
      // User is not available in database and new user, so we will add into database
      const newUser = await this.tbl_usersModel.create({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        birthday: user.birthday,
      });
      return res.json(newUser);
    }
  }

  // Create new user
  async insertUser(req, res) {
    console.log(`insertUser-POST: ${JSON.stringify(req.body)}`);
    const { first_name, last_name, email, birthday } = req.body;

    try {
      const [newUser, created] = await this.tbl_usersModel.findOrCreate({
        where: { email: email },
        defaults: {
          first_name: first_name,
          last_name: last_name,
          email: email,
          birthday: new Date(birthday),
        },
      });
      // Respond with newuser
      if (created) {
        console.log('New User Created!');
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

        console.log('User Updated!');
        return res.json(updatedUser);
      } else {
        // User does not exist, return an error
        return res.status(404).json({ error: true, msg: 'User not found' });
      }
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Create retrieve all the target performance set by a given user
  async findUserTargets(req, res) {
    // Find all users with their associated tasks
    // Raw SQL: Eager Loading: SELECT * FROM "Users" JOIN "Tasks" ON "Tasks"."userId" = "Users".id;
    const { email } = req.query;
    console.log(`POST: ${JSON.stringify(email)}`);
    try {
      // Find all users with their associated email
      const user = await this.tbl_usersModel.findOne({
        where: { email: email },
        include: {
          model: this.tbl_target_pefModel, //association
        },
      });

      // Respond with new user
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

        if (targetPerformance.length > 0) {
          // Update the target performance values
          await targetPerformance[0].update({
            push_up: push_up,
            sit_up: sit_up,
            run: run,
            end_date: end_date,
          });

          return res.status(200).json({
            success: true,
            msg: 'Target performance updated successfully.',
          });
        } else {
          await this.tbl_target_pefModel.create({
            push_up: push_up,
            sit_up: sit_up,
            run: run,
            start_date: new Date(),
            end_date: end_date,
            user_id: user_id,
          });
          return res.status(200).json({
            success: true,
            msg: 'Target performance updated successfully.',
          });
        }
      } else {
        // User does not exist, return an error
        return res.status(404).json({ error: true, msg: 'User not found.' });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, msg: 'Internal server error.' + err.message });
    }
  }

  // Create updateTargetByEmail
  async insertUserDaily(req, res) {
    const { sit_up, push_up, run, user_id, today_date } = req.body;

    try {
      // Find the user by user_id
      const existingUser = await this.tbl_usersModel.findOne({
        where: { id: user_id },
      });

      if (existingUser) {
        // Check if there is an existing entry for the current day
        const today = new Date(today_date);
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);
        // Find or create the current performance record for the given date
        let [currentPerformance, created] =
          await this.tbl_current_perfModel.findOrCreate({
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

        return res.status(200).json({
          success: true,
          msg: 'Target performance updated successfully.',
        });
      } else {
        // User does not exist, return an error
        return res.status(404).json({ error: true, msg: 'User not found.' });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, msg: 'Internal server error.' });
    }
  }
}

module.exports = LookupController;
