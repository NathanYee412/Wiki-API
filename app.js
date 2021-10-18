const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public')); //Serves resources from public folder
app.set("view engine", "ejs"); // set view engine to use ejs

// Mongoose setup
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const articleModel = mongoose.model(
    "articles",
    articleSchema
);

// Fetch all articles in the database 
app.get("/articles", (req, res) =>{
    articleModel.find({}, (err, results) =>{
        if(err){
            res.send(err);
        } else{
            res.send(results);
        }
    });
});


// Using Postman to post data. 
// POST to localhost:3000/articles
// Body -> x-www-form-urlencoded
// key: title Value: Some title
// key: content Value: some content
app.post("/articles", (req, res) =>{
    console.log(req.body.title);
    console.log(req.body.content);

    // Saving data to the DB 
    const newArticle = new articleModel({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err) =>{
        if(err){
            res.send(err);
        } else{
            res.send("Successfully added a new article");
        }
    });


});


app.listen(3000, () =>{
    console.log("app running on port 3000");
});