// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
    //   $("#articles").append("<p data-id='" + data[i]._id + "'><a href='"+data[i].link+"' target='_blank'>"+ data[i].title + "</a></p>");
      $("#articles").append("<div class='card' style'width: 18rem;'> <img src='" + data[i].img + "' class='card-img-top' alt='img'><div class='card-body'><h5 data-id='" + data[i]._id + "' class='card-text'>" + data[i].title + "</h5><br><p class='mb-0'><strong>" + data[i].author + "</strong></p><p class='mb-0'>" + data[i].date + "</p></br><div = class''><a href='" + data[i].link + "' target='_blank' class='btn btn-primary btn-block'>checkout the article</a></div></div></div>");
    }
  });
  
//   <div class='card' style'"width: 18rem;'> 
//  // <img src="..." class="card-img-top" alt="...">
//   //<div class="card-body">
//   //<h5 class="card-title">Card title</h5>
//   //<p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
//   //<a href="#" class="btn btn-primary">Go somewhere</a>
//   </div>
// </div>
  
  // Whenever someone clicks a p tag
  $(document).on("click", "h5", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
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
        $("#subNotes").append("<input id='titleinput' name='title' class='form-control'>");
        $("#subNotes").append("<label for='sel1'>body:</label>");
        // A textarea to add a new note body
        $("#subNotes").append("<textarea id='bodyinput' name='body' class='form-control'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#subNotes").append("<button class='btn btn-primary mt-2 mb-2' data-id='" + data._id + "' id='savenote'>Save Note</button>");
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
  