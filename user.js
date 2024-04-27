const express = require("express");
const path = require("path");
const router = express.Router();
const collection = require("./config");
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
app.use(express.json());

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'websession',
    resave: true,
    saveUninitialized: true,
}));



app.get("/login", (req, res) => {
    res.render("login", { session: req.session });
});

app.get("/register", (req, res) => {
    res.render("register");
});


app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
})


app.get("/home", (req, res) => {
    const username = req.session.username; // Retrieve username from session
    res.render("home", { username: username }); 
});

// Register User
app.post("/register", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }
    console.log("user successfully registered");

    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });

    if (existingUser) {
        res.status(400);
        res.send('User already exists. Please choose a different username.');
    } else {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(data.password, 10);

        data.password = hashedPassword; // Replace the original password with the hashed password

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.redirect('/login');
    }

});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found");
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            
            req.session.username = req.body.username;
            console.log(check, isPasswordMatch);
            res.redirect("/home");
        }
    }
    catch {
        res.send("wrong Details");
    }
});

module.exports = app;
