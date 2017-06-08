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
});


// Routes

app.get("/", function(req,res){
	res.send(index);
});


app.get("/scrape", function(req,res){

	request('http://www.surfline.com/surf-news/', function (error, response, html) {

		// Load the HTML into cheerio and save it to a variable
	  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
	  var $ = cheerio.load(html);

	  // An empty array to save the data that we'll scrape
	  var result = [];

	  
	  $("ul#surf-feed.story-list li").each(function(i, element) {

	    
	    var imgLink = $(element).find("a").find("img").attr("src");
	    var title = $(element).find("a").text().trim();
	    var date = $(element).find("span").text().trim();
	    var paragraphArray = $(element).after("span.date").text().trim().split(") ");
	    var summary = paragraphArray[1];

	    // Push the image's URL (saved to the imgLink var) into the result array
	    result.push({ Title: title, Summary: summary, Img: imgLink, Date: date  });
	  });
	    
	  console.log(result);
	  res.send(result);
	});
})





// Listen on port 3000
app.listen(8000, function() {
  console.log("App running on port 8000!");
});