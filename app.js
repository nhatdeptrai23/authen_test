//jshint esversion:6
require("dotenv").config();
const ejs = require("ejs");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

//connect to MongoDB by specifying port to access MongoDB server
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://localhost:27017/userDB');
};

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const secret = "This is our litter secret";
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("home");
})

app.get("/login", function(req, res){
    res.render("login");
})

app.get("/register", function(req, res){
    res.render("register");
})


app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password

    });

    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets");
        };
    });
});

app.post("/login",function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, function(err, foundUser){
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                if(foundUser.password === password){
                    res.render("secrets");
                }
            }
        }
    })
})


app.listen("3000",function (req, res) {
    console.log("Sever work on port 3000");
});

