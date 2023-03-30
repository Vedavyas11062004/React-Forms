const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt=require('bcrypt');

app.use(cors());
app.use(express.json());

// connecting to database

const url =
  "mongodb+srv://vedavyas14042003:Nl3xp2nDk3IFR3UT@cluster0.jxlcufo.mongodb.net/?retryWrites=true&w=majority";

const start = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(1337, console.log("listening to port 1337"));
  } catch (error) {
    console.log(error);
  }
};
start();

// creating models

const Schema = mongoose.Schema;
const SchemaModel = new Schema(
  {
    email: { type: String, required: true },
    password: { type: String, required: true, min: 8 }
  },
  { collection: "user-data" }
);
const model = mongoose.model("model", SchemaModel);

// creating routes and using the model

 function validateErrors (data) {
  const email = data.email;
  const password = data.password;
  const confirmpassword = data.confirmpassword;
  if (password !== confirmpassword) {
    return false
  }
  let salt= bcrypt.genSaltSync()
  let hashedstring= bcrypt.hashSync(password,salt)
  data.password=hashedstring
  return true
}

app.post("/api/signup", async (req, res) => {

  const email=req.body.email
  const findingele=await model.findOne({
    email:email
  })
  if (findingele) {
    return res.json({ status: "error", user: false });
  }
  const isvalid = validateErrors(req.body);
  if (!isvalid) {
    return res.json({ status: "error", user: false });
  }
  const user = await model.create({
    email: req.body.email,
    password: req.body.password
  });
  // create token 
  
  if (user) {
    return res.json({ status: "ok", user: user });
  } else {
    return res.json({ status: "error", user: false });
  }
});

app.get("/api/signin", async (req, res) => {
  const user = await model.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (user) {
    return res.json({ status: "ok", user: user });
  } else {
    return res.json({ status: "error", user: false });
  }
});
