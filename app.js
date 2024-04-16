require('dotenv').config();
const express = require('express');
const path = require('path');
const app = require('./server'); // Import the Express app instance from server.js
const passport = require('passport');
const initializePassport = require('./passport_config');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const router = express.Router()


// set the view engine to ejs
app.set('view engine', 'ejs');
app.set("views", [
    path.join(__dirname, "views"),
    path.join(__dirname, "views", "auth_views")
]);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const client = new MongoClient("mongodb+srv://abc:passw0rd@cluster0.snv9zih.mongodb.net/", {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function getQuizData() {
    try {
        await client.connect();
        const result = await client.db("quiz-database").collection("quiz-collection").find().toArray();
        return result;
    } catch (err) {
        console.log("getQuizData() error:", err);
    } finally {
        await client.close();
    }
}


app.get('/', async (req, res) => {
    const result = await getQuizData();
    res.render('index', {
        pageTitle: "Quiz App",
        quizData: result
    });
});

app.post('/addQuiz', async (req, res) => {
    try {
        client.connect();
        const collection = client.db("quiz-database").collection("quiz-collection");
        console.log(req.body);
        await collection.insertOne(req.body);
        res.redirect('/');
    } catch (err) {
        console.log(err)
    }
});

app.post('/updateQuiz', async (req, res) => {
    try {
        console.log("req.body: ", req.body);
        client.connect();
        const collection = client.db("quiz-database").collection("quiz-collection");
        let result = await collection.findOneAndUpdate(
            { "_id": new ObjectId(req.body.id) },
            { $set: { question: req.body.question, answer: req.body.answer } }
        );
        console.log(result);
        res.redirect('/');
    } catch (err) {
        console.error(err);
    }
});

app.post('/deleteQuiz', async (req, res) => {
    try {
        client.connect();
        const collection = client.db("quiz-database").collection("quiz-collection");
        console.log(req.body);
        let result = await collection.findOneAndDelete(
            { "_id": new ObjectId(req.body.id) }
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
    }
});

app.get('/send', function (req, res) {
    res.send('Hello World from Express <br><a href="/">home</a>');
});

const port = process.env.PORT || 5500;
app.listen(port, () => {
    console.log(`ubiquiz listening on port ${port}`);
});

initializePassport(passport);
app.use(passport.initialize());
app.use(passport.session());