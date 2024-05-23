const express = require("express");
const app = express();
const session = require("express-session");
const router = require("./routers/userRouter");
const adminRouter = require("./routers/adminRouter");
const morgan = require("morgan");
const PORT = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.use(
  session({
    secret: "xxxxxx",
    resave: false,
    saveUninitialized: true,
  })
);
app.use((req,res,next)=>{
  console.log(req.params)
  next()
})
app.use((req, res, next) => {
  res.set({
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: 0,
  });
  next()
});
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/admin", adminRouter);
app.use("/", router);
app.use((err, req, res, next) => res.status(500).send(err.message));

app.listen(PORT, () => console.log(`Server running at port : ${PORT}`));
