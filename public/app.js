$("#savedArticles").on("click", function(event) {
  $("#articles").empty();
  event.preventDefault();
  console.log("i clicked to view saved posts");
  window.location.href = "/saved";
});

// Whenever someone clicks a p tag
$(document).on("click", "h5", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
  

  $(".scrape-new").on("click", function(event) {
    event.preventDefault();

    $.ajax("/scrape", {
      type: "GET"
    }).then(function() {
      console.log("finished scrape");
      setTimeout(() => {
        window.location.href = "/";
      }, 5000);
    });
  });


  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      $("#notes").append("<div class='card container'id='subNotes'>");
      $("#subNotes").append("<div class='form-group'>");
      // The title of the article
      $("#subNotes").append("<h2>" + data.title + "</h2>");
      $("#subNotes").append("<label for='sel1'>Title:</label>");
      // An input to enter a new title
      $("#subNotes").append(
        "<input id='titleinput' name='title' class='form-control'>"
      );
      $("#subNotes").append("<label for='sel1'>body:</label>");
      // A textarea to add a new note body
      $("#subNotes").append(
        "<textarea id='bodyinput' name='body' class='form-control'></textarea>"
      );
      // A button to submit a new note, with the id of the article saved to it
      $("#subNotes").append(
        "<button class='btn btn-primary mt-2 mb-2' data-id='" +
          data._id +
          "' id='savenote'>Save Note</button>"
      );
      $("#subNotes").append("</div>");
      $("#notes").append("</div>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// When you click the Save Article button
$(document).on("click", "#saveArt", function() {
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  $.ajax({
    method: "PUT",
    url: "/saved/" + thisId
  })
  .done(function(data) {
    console.log(data);
  });
});

// When you click the Save Article button
$(document).on("click", "#deleteArt", function() {
  var thisId = $(this).attr("data-id");
  console.log(thisId);

  $.ajax({
    type: "PUT",
    url: "/delete/" + thisId
  })
  .done(function(data) {
    console.log(data);
    window.location.href = "/saved";
  });
});
