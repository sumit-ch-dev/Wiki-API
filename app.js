const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true, useUnifiedTopology: true });


const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);


/// request targeting all articles

app.route("/articles")
    .get((req, res) => {
        Article.find().then(foundArticles => {
            res.send(foundArticles);
        }).catch(err => {
            res.send(err)
        })
    })
    .post((req, res) => {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save().then(() => {
            res.send("Successfully added a new article")
        }).catch(err => {
            res.send(err)
        })
    })
    .delete((req, res) => {
        Article.deleteMany().then(() => {
            res.send("Successfully deleted all articles")
        }).catch(err => {
            res.send(err)
        })
    })

    ///request targeting a specific article

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }).then(foundArticle => {
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("No articles matching that title was found")
            }
        }).catch(err => {
            res.send(err)
        })
    })
    .put((req, res) => {
        Article.findOneAndUpdate({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content }, { overwrite: true }).then(() => {
            res.send("Successfully updated article")
        }).catch(err => {
            res.send(err)
        })
    })
    .patch((req, res) => {
        Article.findOneAndUpdate({ title: req.params.articleTitle }, { $set: req.body }).then(() => {
            res.send("Successfully updated article")
        }).catch(err => {
            res.send(err)
        })
    })
    .delete((req, res) => {
        Article.findOneAndDelete({ title: req.params.articleTitle }).then(() => {
            res.send("Successfully deleted article")
        }).catch(err => {
            res.send(err)
        })
    })
    



app.listen(3000, function () {
    console.log("Server started on port 3000");
})

