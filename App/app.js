const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const app = express();

const mongoose=require("mongoose");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(session({
  secret:"Our little secret.",
  resave:false,
  saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());


const urldb="MongoDB";
mongoose.connect(urldb,{useNewUrlParser:true,useUnifiedTopology: true }).catch(err => {
  console.log(err);
});
mongoose.set("useCreateIndex",true);

const userSchema=new mongoose.Schema({
    email:String,
    password:String,
    customer_id:String
  });

const dataSchema=new mongoose.Schema({
  Customer_ID:String,
  First_Name:String,
  Last_name:String,
  Contact_No:String,
  Credit_Score:String
})

userSchema.plugin(passportLocalMongoose);
const User=new mongoose.model("User",userSchema,"User_Login");
const Data=new mongoose.model("Data",dataSchema,"User_Data");


passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});

let port=process.env.PORT;
if(port==null||port==""){
  port=5000;
}

app.listen(port,()=>{
    console.log("Server Started Successfully");
})


app.get("/",function(req,res){
res.render("Home");
});

app.get("/logout",function(req,res){
  req.logout();
  res.redirect("/");
});

app.get("/login",function(req,res){
  res.render("Login");
});

app.post("/login",function(req,res){
  const user=new User({
      username:req.body.username,
      password:req.body.password
  });
  req.login(user,function(err){
      if(err){
          res.send(err);
      }else{
          passport.authenticate("local")(req,res,function(){
            res.redirect("/userhome");
          });
      }
  });
});


app.get("/userhome",(req,res)=>{  
if(req.isAuthenticated()){

  Data.findOne({Customer_ID:req.user.customer_id},function(err,foundUser){
    if(!err){
      if(!foundUser){
        res.send("User not found");
      }
      else{
        res.render("Userhome",{
              First_Name:foundUser.First_Name,
              Last_name:foundUser.Last_name,
              Credit_Score:foundUser.Credit_Score,
              customer_id:foundUser.Customer_ID
            });
      }
    }
  });

}
else{
    res.redirect("/login");
}
});

app.get("/signup",function(req,res){
  res.render("Signup");
});

app.post("/signup",function(req,res){
  const newUser=new User({
    username:req.body.username,
    customer_id:req.body.customer_id
});
  User.register(newUser,req.body.password,function(err,user){
      if(err){
         res.send(err);
      }
      else{
          passport.authenticate("local")(req,res,function(){ 
              res.redirect("/login")
          })
      }
  });
});

app.get("/what",function(req,res){
  res.render("What");
});

app.get("/contact",function(req,res){
  res.render("Contact");
});
