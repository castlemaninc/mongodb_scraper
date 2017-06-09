// Require mongoose
var mongoose = require("mongoose");
// Create article schema
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true
  },
  // summary is a required string
  summary: {
    type: String,
    required: true
  },

  imglink: {
    type: String,
    required: false
  },

  date: {
    type: String,
    required: true
  }
  // This only saves one note's ObjectId, ref refers to the Note model
  // note: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Note"
  // }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;