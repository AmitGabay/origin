//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res) {
    res.render("home");
});

app.route("/login")
.get(function(req, res) {
    res.render("login");
})
.post(function(req, res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email: username}, function(err, foundUser){
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.render("secrets");
                } else {
                    alert("Wrong Password, please try again.");
                }
            } else {
                alert("Wrong Email, please try again.");
            }
        }
    });
});

app.route("/register")
.get(function(req, res) {
    res.render("register");
})
.post(function(req, res){
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save(function(err){
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});





app.listen(3000, function(req, res) {
    console.log("Server has started on port 3000.");
});