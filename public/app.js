// Grab the articles as a json
$.getJSON("/api", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].date + "<br />" + "<strong>" + data[i].title + "</strong>" + "<br />" + data[i].summary + "</p>");
    







  }
});