
var x = "edit";
// Grab the articles as a json
$.getJSON("/api", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<div class='panel panel-default clearfix data-id='" + data[i]._id + "'>" + "<img src='" + data[i].imglink + "'>" + "<br /><br />" + data[i].date + "<br />" + "<strong>" + data[i].title + "</strong>" + "<br />" + data[i].summary + "<button type='button' class='btn btn-info pull-right' data-id='" + data[i]._id + "' id='addNote'>" + "Add Note" + "</button>" + "</div>");
  }
});


// Whenever someone clicks add note button
$(document).on("click", "#addNote", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the div tag
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/api/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// Create a new note or replace an existing note
app.post("/api/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });