const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const exphbs = require("express-handlebars");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const cookieParser = require("cookie-parser");


app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(cookieParser());

app.listen(3000, () => {
  console.log("We've now got a server!");
});

//============================= ROUTES ============================//

/*To Do:
1. Create Middleware
2. post /login 
*/



app.get("/",(req,res)=>{
  res.send("This is the homepage");
})

app.get("/login",(req,res)=>{
  res.send("Login form will be served Here. \nForm Will have 2 buttons -> Login,Signup");
})

app.post("/login",async(req,res)=>{
  console.log("username : ",req.body.username);
  console.log("password: ",req.body.password);
  
	let hashedPass ; 
	let userId ;
	
	const usersFromDB = await UserFunctions.getAllUsers();

	for(let i=0; i<usersFromDB.length; i++)
		{
			if(req.body.username==usersFromDB[i].username)
				{
					hashedPass = usersFromDB[i].hashedPassword;
					userId = usersFromDB[i]._id;
				}
		}
	
	let comparedVal = await bcrypt.compare(req.body.password, hashedPass);

	if(comparedVal)
			{
				res.cookie("AuthCookie", userId);
				//res.render(__dirname + "/data", {"nameOfTheCourse":nameOfTheCourse, "lastName":lastName, "bio": bio, "profession": profession});
				res.redirect("/homepage");
			}
	else
			{
				let hasErrors = true;
				let errors = [];
				errors.push("username/password does not match");
				res.status(403).render(__dirname + "/login", {"hasErrors":hasErrors, "errors":errors});
				return;
			}
})

app.get("/signup",(req,res)=>{
  res.send("This is the signup page");
})

app.post("/signup",(req,res)=>{
  let createdUser = {
    "_id": uuid.v4(),
    "name" : req.body.name,
    "age" : req.body.age,
    "email": req.body.email,
    "contact": req.body.contact,
    "enrolledIn": req.body.enrolledIn,
    "isAdmin": req.body.isAdmin,
    "deltas": req.body.deltas,
    "changes": req.body.changes
  }


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