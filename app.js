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

// ///////////////////////////// Requests targeting all articles ////////////////////////////


app.route("/articles")
    .get((req, res) =>{ // Fetch all articles in the database 
        articleModel.find({}, (err, results) =>{
        if(err){
            res.send(err);
        } else{
            res.send(results);
            }
        });
    })
    .post((req, res) =>{
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
    })
    .delete((req, res) => {
        articleModel.deleteMany({}, (err) =>{
            if(err){
                res.send(err);
            } else{
                res.send("Successfully deleted everything");
            }
        });
    });

// ///////////////////////////// Requests targeting specific articles ////////////////////////////

app.route("/articles/:articleTitle")
    .get((req, res) =>{

        articleModel.findOne({title: req.params.articleTitle}, (err, foundArticle) => {
            if(foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No article found");
            }
        });
    })
    .put((req, res) => {
        articleModel.updateOne(
            {title: req.params.articleTitle},   // target
            { $set: {title: req.body.title, content: req.body.content}}, // what we are replacing
            (err, results) =>{ // callback function
                if(err){
                    res.send(err);
                } else{
                    res.send("Successfully updated article");
                }
            }
        );
    })
    .patch((req, res) => { // will update only the value that was provided 
        articleModel.updateOne(
            {title: req.params.articleTitle},
            {$set: req.body},
            (err, result) => {
                if(err){
                    res.send(err);
                }else {
                    res.send("Updated docuemnt");
                }
            }
        );
    })
    .delete((req, res) => {
        articleModel.deleteOne(
            {title: req.params.articleTitle},
            (err, result) => {
                if(err){
                    res.send(err);
                }else {
                    res.send("Successfully deleted");
                }
            }
        );
    });



app.listen(3000, () =>{
    console.log("app running on port 3000");
});



/*
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

// deleteMany will delete all articles. The first argument is left empty so it will delete
// everything
app.delete("/articles", (req, res) => {
    articleModel.deleteMany({}, (err) =>{
        if(err){
            res.send(err);
        } else{
            res.send("Successfully deleted everything");
        }
    });
});
*/

