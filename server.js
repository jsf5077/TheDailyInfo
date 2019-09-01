var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Set Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configure middleware

//morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var DB_Connect =
  process.env.MONGODB_URI || "mongodb://localhost/theDailyLeopard";

mongoose.connect(DB_Connect, { useNewUrlParser: true }, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to the db");
  }
});

// Routes
app.get("/", (req, res) => {
  db.Article.find({})
    .then(function(Article) {
      console.log(Article);

      res.render("body", {
        Article: Article
      });
    })
    .catch(err => {
      res.json(err);
    });
});

// Route for getting saved article
app.get("/saved", (req, res) => {

  db.Article.find({ isSaved: true })
    .then(function(saved) {
      console.log(saved);
      
      res.render("body", {
        Article: saved
      });
    })
    .catch(err => {
      res.json(err);
    });
});


// A GET route for scraping the website

app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://worldanimalnews.com").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    var result = {};

    $(".td_module_3").each(function(i, element) {

      var title = $(element)
      // result.title = $(element)
        .find(".entry-title")
        .children()
        .attr("title");

        var link = $(element)
      // result.link = $(element)
        .find(".entry-title")
        .children()
        .attr("href");

        var img = $(element)
      // result.img = $(element)
        .find("a")
        .children("img")
        .attr("src");

      var author = $(element)
      // result.author = $(element)
        .find(".td-post-author-name")
        .children("a")
        .text()
        .trim();

      var date = $(element)
      // result.date = $(element)
        .find(".td-post-date")
        .children("time")
        .text()
        .trim();

      // Create a new Article using the `result` object built from scraping
      db.Article.create({
        title:title,
        link:link,
        img:img,
        author:author,
        date:date 
      })
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
    // Send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      // If the User was updated successfully, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route for saving/updating article to be saved
app.put("/saved/:id", function(req, res) {
  db.Article.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { isSaved: true } }
  )
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Route for deleting/updating saved article
app.put("/delete/:id", function(req, res) {
  db.Article.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { isSaved: false } }
  )
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
