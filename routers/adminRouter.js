const express = require("express");
const router = express.Router();
const { adminCollection,userCollection } = require("../dbConnect");

//Admin authentication
router.post("/login", async (req, res, next) => {
  try {
    const result = await adminCollection.countDocuments({
      $and: [{ username: req.body.username }, { password: req.body.password }],
    });
    if (result === 1) {
      req.session.admin=true
    } else {
      res.send('WRONG CREDENTIALS');
    }
  } catch (error) {
    next(error);
  }
});

router.get("/getAll", async (req, res) => {
  try {
    const result = await userCollection.find();
  } catch (error) {
    next(error);
  }
});

router.delete("/deleteUser", async (req, res) => {
  try {
    const result = await userCollection.deleteOne();
    res.send("USER DELETED");
  } catch (error) {
    next(error);
  }
});

router.post("/updateUser", async (req, res) => {
  try {
    const result = await userCollection.updateOne();
    res.send("USER UPDATED");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
