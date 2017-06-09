// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/mongodbscraper");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
  // console.log(db);
});


// Routes

app.get("/", function(req,res){
	res.send(index);
});


app.get("/api", function(req,res){

	request('http://www.surfline.com/surf-news/', function (error, response, html) {

		// Load the HTML into cheerio and save it to a variable
	  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
		var $ = cheerio.load(html);


		$("ul#surf-feed.story-list li").each(function(i, element) {

			// Save an empty result object
			var result = {};

			// Add the text and href of every link, and save them as properties of the result object
			result.imgLink = $(this).find("a").find("img").attr("src");
			result.title = $(this).find("a").text().trim();
			result.date = $(this).find("span").text().trim();

			var paragraphArray = $(this).after("span.date").text().trim().split(") ");
			result.summary = paragraphArray[1];

			// Push the image's URL (saved to the imgLink var) into the result array
			// result.push({ Title: title, Summary: summary, Img: imgLink, Date: date  });

			// Using our Article model, create a new entry
			// This effectively passes the result object to the entry (and the title and link)
			var entry = new Article(result);

			// Now, save that entry to the db
			entry.save(function(err, doc) {
					// Log any errors
					if (err) {
					console.log(err);
				}
					// Or log the doc
					else {
					console.log(doc);
				}
			});

			console.log(result);			

		});	  
	    
		
	});
})

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});



// Listen on port 3000
app.listen(8000, function() {
  console.log("App running on port 8000!");
});