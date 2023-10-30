const express = require('express');
const router = express.Router();

class IpptsRouter {
  constructor(controller) {
    this.controller = controller;
    //this.checkJwt = checkJwt;
  }
  routes() {
    // routes for backend entry
    router.get('/', this.controller.getTotalPoints.bind(this.controller));
    router.get(
      '/target',
      this.controller.findUserTargets.bind(this.controller)
    );
    router.get(
      '/history',
      this.controller.findUserHistory.bind(this.controller)
    );
    router.get(
      '/userachievement',
      this.controller.getUserAchievements.bind(this.controller)
    );
    router.get(
      '/addachievement',
      this.controller.addUserAchievements.bind(this.controller)
    );
    router.post(
      '/daily',
      this.controller.insertUserDaily.bind(this.controller)
    );
    router.post(
      '/user',
      // this.checkJwt,
      this.controller.insertUser.bind(this.controller)
    );
    router.post(
      '/updateuser',
      this.controller.updateUserByEmail.bind(this.controller)
    );
    router.post(
      '/updatetarget',
      this.controller.updateUserTarget.bind(this.controller)
    );
    router.post(
      '/checkUser',
      // this.checkJwt,
      this.controller.checkUser.bind(this.controller)
    );
    return router;
  }
}

module.exports = IpptsRouter;
