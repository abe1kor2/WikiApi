const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const send = require("send");

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String
};


// initializing collection. Content in the brackets will be lowercased and pluralized
const ArticleModel = mongoose.model("Article", articleSchema);


const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));


//////////////////////// Requests Targeting All Articles ////////////////////////////////////////
app.route("/articles")
    .get((req, res) =>{
    
    ArticleModel.find({}, (err, results) =>{
        if(err){
            console.log(err);
        }
        else{
            res.send(results)
        }
        });
    })
    .post((req,res) =>{
        const articlepost = new ArticleModel({
            title: req.body.title,
            content: req.body.content
        })
        articlepost.save((err) =>{
            if(err){
                res.send(err);
            }
            else{
                res.send("Succesfull");
            }
        })
    })
    .delete((req,res) =>{
        ArticleModel.deleteMany({},(err)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send("Successfull");
            }
        })
    });


//////////////////////// Requests Targeting A Specific Articles //////////////////////////////////////
app.get('/articles/:articleId')
    .get((req, res) =>{
        const requestArticleId = req.params.articleId
    
        ArticleModel.findOne({title: requestArticleId}, (err, results) =>{
            if(err){
                console.log(err);
            }
            else{
                res.send(results)
            }
        });
    })
    .put((req, res) =>{
        const requestArticleId = req.params.articleId
    
        ArticleModel.update({title: requestArticleId},{title: req.body.title, content: req.body.content},{overwrite: true}, (err) =>{
            if(err){
                res.send(results)
            }else{
                res.send("Succesfully Updated")
            }
        });
    })
    .patch((req, res) =>{
        const requestArticleId = req.params.articleId

        ArticleModel.update({title: requestArticleId},{$set: req.body}, (err) =>{
            if(err){
                res.send(results)
            }
            else{
                res.send("Succesfully Patched")
            }
        });
    })
    .delete((req, res) =>{
        const requestArticleId = req.params.articleId
    
        ArticleModel.deleteOne({title: requestArticleId}, (err)=>{
            if(err){
                res.send(err);
            }
            else{
                res.send("Successfully Deleted");
            }
        });
    })

app.listen(PORT, () => console.log(`Server is running on localhost:${PORT}`));