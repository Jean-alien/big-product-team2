require('dotenv').config();
const express = require('express');
const app = express()
let path = require('path');
//const passport = require('passport');
//const initializePassport = require('./config');
const collection = require("./config");
const bcrypt = require('bcrypt');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const router = express.Router()
const userRouter = require('./user');


// set the view engine to ejs
app.set('view engine', 'ejs');
app.set("views", [
    path.join(__dirname, "views")
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
        const result = await client
            .db("quiz-database")
            .collection("quiz-collection")
            .find()
            .toArray();
        return result;
    } catch (err) {
        console.log("getQuizData() error:", err);
    } finally {
        //await client.close();
    }
}


app.get('/', async (req, res) => {
    let result = await getQuizData().catch(console.error);

    console.log("getQuizData() result:", result);

    res.render('index', {
        pageTitle: "Quiz App",
        quizData: result
    });
});

app.post('/addQuiz', async (req, res) => {
  
    try {

      client.connect; 
      const collection = client.db("quiz-database").collection("quiz-collection");
      
      //draws from body parser
      console.log(req.body);
      
      await collection.insertOne(req.body);

        
      res.redirect('/');
    }
    catch(err){
      console.log(err)
    }
    finally{
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

app.get('/flashcards', async (req, res) => {

    let result = await getQuizData().catch(console.error); 
  
    console.log("getQuizData() result:", result);
  
    res.render('flashcards', {
      pageTitle: "Quiz App",
      quizData: result 
  
    }); 
  });

  app.post('/addQuiz2', async (req, res) => {
  
    try {

      client.connect; 
      const collection = client.db("quiz-database").collection("quiz-collection");
      
      //draws from body parser
      console.log(req.body);
      
      await collection.insertOne(req.body);

        
      res.redirect('/flashcards');
    }
    catch(err){
      console.log(err)
    }
    finally{
    }
  
  });

app.post('/updateQuiz2', async (req, res) => {
    
    
    try {
        console.log("req.body: ", req.body);
        client.connect();
        const collection = client.db("quiz-database").collection("quiz-collection");
        let result = await collection.findOneAndUpdate(
            { "_id": new ObjectId(req.body.id) },
            { $set: { question: req.body.question, answer: req.body.answer } }
        );
        console.log(result);
        res.redirect('/flashcards');
    } catch (err) {
        console.error(err);
    }
});

app.post('/deleteQuiz2', async (req, res) => {
    try {
        client.connect();
        const collection = client.db("quiz-database").collection("quiz-collection");
        console.log(req.body);
        let result = await collection.findOneAndDelete(
            { "_id": new ObjectId(req.body.id) }
        );
        res.redirect('/flashcards');
    } catch (err) {
        console.error(err);
    }
});

// Use the userRouter defined in user.js
app.use('/', userRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`ubiquiz listening on port ${port}`);
});
