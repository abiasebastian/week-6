const express = require("express");
const router = express.Router();
const mongo = require("../dbConnect");
const { ObjectId } = require("mongodb");
const session = require("express-session");

(async () => {
  let adminCollection;
  let userCollection;

  await mongo().then((db) => {
    adminCollection = db.adminCollection;
    userCollection = db.userCollection;
  });

  //Admin Homepage
  router.get("/", async (req, res, next) => {
    try {
      if (req.session.admin) {
        const result = await userCollection.find().toArray();
        res.render("adminHome", { userList: result });
      } else {
        res.render("adminLogin");
      }
    } catch (error) {
      next(error);
    }
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
      console.log(result);
      if (result === 1) {
        req.session.admin = true;
        res.redirect("/admin");
      } else {
        res.send("WRONG CREDENTIALS");
      }
    } catch (error) {
      next(error);
    }
  });

  router.get("/deleteUser/:id", restrictAdmin, async (req, res, next) => {
    try {
      result = await userCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      if (result.deletedCount === 1) {
        res.send("USER DELETED");
      }
    } catch (error) {
      next(error);
    }
  });

  router.post("/updateUser/:id", restrictAdmin, async (req, res, next) => {
    try {
      await userCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: {username:req.body.username, name: req.body.name, batch: req.body.batch } }
      );
      res.send("USER UPDATED");
    } catch (error) {
      next(error);
    }
  })
  
  router.get('/updateUser/:id/:username/:name/:batch', restrictAdmin,async(req,res,next)=>{
    try{
      res.render('editUser',{user:req.params})
    }catch(error){
      next(error)
    }
  });

  router.get('/logout', (req,res)=>{
    try{
      req.session.destroy(()=>res.render('adminLogin'))
    }catch(error){
      next(error)
    }
  })
})();

function restrictAdmin(req, res, next) {
  if (!req.session.admin) {
    return res.render("adminLogin");
  } else {
    next();
  }
}

module.exports = router;
