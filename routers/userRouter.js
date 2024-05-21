const express = require("express");
const router = express.Router();
const mongo = require("../dbConnect");


(async ()=> {
  let userCollection;

 await mongo().then((db) => {
    userCollection = db.userCollection;
  });

  router.get("/", (req, res) => {
    if (req.session.user) {
      console.log(req.session.user);
      //Render profile if a session is set
      res
        .status(200)
        .render("profile", { user: req.session.user, title: "Profile" });
        console.log('session:'+req.session.user)
    } else {
      //Render login page if no session is set
      res.render("index");
    }
  });

  //Log out
  router.get('/logout', (req,res)=>{
    try{
      req.session.destroy(()=>res.render('index'))
    }catch(error){
      next(error)
    }
  })

  //User Authentication
  router.post("/login", async (req, res, next) => {
    try {
      const result = await userCollection.findOne({
        $and: [
          { username: req.body.username },
          { password: req.body.password },
        ],
      });
      if (result) {
        req.session.user={name:result.name,batch:result.batch}
        res.render('profile',{user:req.session.user})
      } else {
        res.send({ authenticated: false });
      }
    } catch (error) {
      next(error);
    }
  });
router.get('/signup',async(req,res,next)=>{
  res.render('signup')
})
  router.post("/signup", async (req, res, next) => {
    try {
      await userCollection.insertOne({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        batch: req.body.batch,
      });
      res.send("User registered");
    } catch (error) {
      next(error);
    }
  });
})();

module.exports = router;
