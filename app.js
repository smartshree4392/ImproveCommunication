const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const exphbs = require("express-handlebars");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.listen(3000, () => {
  console.log("We've now got a server!");
});

//============================= ROUTES ============================//

app.get("/",(req,res)=>{
  res.send("This is the homepage");
})

app.get("/login",(req,res)=>{
  res.send("This is the login page");
})

app.post("/login",(req,res)=>{
  
})

app.get("/signup",(req,res)=>{
  res.send("This is the signup page");
})

app.post("/homepage",(req,res)=>{
  res.send("This is the homepage");
})

app.post("/createChange",(req,res)=>{
  res.send("This is the page where a new change form will be shown");
})

app.post("/change",(req,res)=>{
  res.send("This is where a CHANGE will be shown");
})