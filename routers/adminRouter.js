const express = require("express");
const router = express.Router();
const collections = require("../dbConnect");
(async () => {
  let adminCollection;
  let userCollection;

  await collections().then((db) => {
    adminCollection = db.adminCollection;
    userCollection = db.userCollection;
  });

  //Admin authentication
  router.post("/login", async (req, res, next) => {
    try {
      const result = await adminCollection.countDocuments({
        $and: [
          { username: req.body.username },
          { password: req.body.password },
        ],
      });
      if (result === 1) {
        req.session.admin = true;
      } else {
        res.send("WRONG CREDENTIALS");
      }
    } catch (error) {
      next(error);
    }
  });


  router.delete("/deleteUser", restrictAdmin, async (req, res, next) => {
    if (req.session.user) {
      try {
        const result = await userCollection.deleteOne();
        res.send("USER DELETED");
      } catch (error) {
        next(error);
      }
    } else {
      res.render("adminLogin");
    }
  });

  router.post("/updateUser",restrictAdmin, async (req, res, next) => {
    try {
      const result = await userCollection.updateOne();
      res.send("USER UPDATED");
    } catch (error) {
      next(error);
    }
  });
})();

function restrictAdmin(req, res, next) {
  if (!req.session.admin) {
    return res.render("adminLogin");
  }
  else{
  next();
  }
}

module.exports = router;
