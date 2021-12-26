//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const passport = require("passport");

// const mongodb = require("mongodb");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET;


const User = new mongoose.model("User", userSchema);


app.get("/", function (req, res) {
    res.render("home");
});

app.get("/login", function (req, res) {
    res.render("login");
});


app.get("/register", function (req, res) {
    res.render("register");
});


app.post("/register", function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {

        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        User.findOne({
            email: req.body.username
        }, function (err, foundUser) {
            if (!foundUser) {
                newUser.save(function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Saved successfully");
                        res.render("secrets");
                    }
                });
            } else {
                res.send(`${foundUser.email} already exist`);
            }
        })

    });
});

app.post("/login", function (req, res) {
    const userName = req.body.username;
    const password = req.body.password;
    User.findOne({
        email: userName
    }, function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    if (result === true) {
                        res.render("secrets");
                    }
                });


            }
        }
    });

});

app.listen("3000", function () {
    console.log("Server is started on port 3000");
});