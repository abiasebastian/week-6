const express = require("express");
const router = express.Router();
const {userCollection}=require('./dbConnect')


//Hard coded users list
let credential = [
  {
    username: "abiasebastian",
    password: "password",
    name: "Abi A Sebastian",
    batch: "BCR59",
  },
  {
    username: "vvprasad",
    password: "password",
    name: "Vishnu Prasad V V",
    batch: "BCR59",
  },
];


router.get("/", (req, res) => {
  if (req.session.user) {
    console.log(req.session.user);
    //Render profile if a session is set
    res.status(200).render("profile", { user: req.session.user,title:'Profile' })
  } else {
    //Render login page if no session is set
    res.render("index");
  }
});

//Log out
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

//User Authentication
router.post("/login", async (req, res) => {
  try {
    const result = await userCollection.countDocuments({
      $and: [
        { username: req.body.username },
        { password: req.body.password },
      ],
    });
    if (result === 1) {
      res.send({ authenticated: true });
    } else {
      res.send({ authenticated: false });
    }
  } catch(error) {
    next(error)
  }
});

router.post('/signup',async (req,res)=>{
 
})



module.exports = router;
