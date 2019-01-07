require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
var session = require("express-session");
const cookieParser = require("cookie-parser");
const { sign, verify } = require("jsonwebtoken");
const DataSchema = require("./data");
const UserSchema = require("./user");

const API_PORT = 3001;
const app = express();
const router = express.Router();

const { DB_USER, DB_PASS } = process.env;
const dbRoute = `mongodb://${DB_USER}:${DB_PASS}@ds149344.mlab.com:49344/coding-diary`;
const dbUsersRoute = `mongodb://${DB_USER}:${DB_PASS}@ds149414.mlab.com:49414/coding-diary-users`;

var dataConn = mongoose.createConnection(dbRoute);
var userConn = mongoose.createConnection(dbUsersRoute);

var User = userConn.model("User", UserSchema);
var Data = dataConn.model("Data", DataSchema);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));
app.use(cookieParser());
app.use(
  session({
    secret: "work hard",
    resave: true,
    saveUninitialized: false
  })
);

router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// router.post("/updateData", (req, res) => {
//   const { id, update } = req.body;
//   Data.findOneAndUpdate(id, update, err => {
//     if (err) return res.json({ success: false, error: err });
//     return res.json({ success: true });
//   });
// });

router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.remove({ _id: id }, (err, itemRemoved) => {
    if (err) return res.status(500).send(err);
    return res.json({ success: true });
  });
});

router.post("/putData", (req, res) => {
  let data = new Data();
  const { id, title, message, code, originUrl, labels, isPublic } = req.body;

  if ((!id && id !== 0) || !message || !title) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }
  data.id = id;
  data.title = title;
  data.message = message;
  data.code = code;
  data.originUrl = originUrl;
  data.labels = labels;
  data.isPublic = isPublic === "public";
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

router.post("/putUser", (req, res, next) => {
  let user = new User();
  const { email, username, password, passwordConf } = req.body;
  if (email && username && password && passwordConf) {
    user.email = email;
    user.username = username;
    user.password = password;
    user.passwordConf = passwordConf;
    user.save(err => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true });
    });
  } else {
    var err = new Error("All fields required.");
    err.status = 400;
    return next(err);
  }
});

router.post("/loginUser", (req, res, next) => {
  if (req.body.logemail && req.body.logpassword) {
    User.authenticate(
      req.body.logemail,
      req.body.logpassword,
      (error, returnedUser) => {
        returnedUser;
        if (error || !returnedUser) {
          var err = new Error("Wrong email or password.");
          err.status = 401;
          return next(err);
        } else {
          req.session.userId = returnedUser._id;
          console.log("user id in session", req.session.userId);
          const secret = "charlie!";
          const person = sign(req.session.userId, secret, {
            expiresIn: 604800 // 1 week
          });
          const token = `jwt=${person}: HttpOnly`;
          res.status(200).cookie("cookie", token);
          return res.json({ success: true, auth: true });
        }
      }
    );
  } else {
    var err = new Error("All fields required.");
    err.status = 400;
    return next(err);
  }
});

app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
