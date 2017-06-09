
var x = "edit";
// Grab the articles as a json
$.getJSON("/api", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<div class='panel panel-default clearfix data-id='" + data[i]._id + "'>" + "<img src='" + data[i].imglink + "'>" + "<br /><br />" + data[i].date + "<br />" + "<strong>" + data[i].title + "</strong>" + "<br />" + data[i].summary + "<button type='button' class='btn btn-info pull-right'>" + "Add Note" + "</button>" + "</div>");
    

				





  }
});