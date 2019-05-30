fetch("https://opentdb.com/api_category.php")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    var quizList = data.trivia_categories;
    quizList.forEach(function(quiz) {
      var quizDiv = document.createElement("div");
      var quizName = document.createElement("h3");
      var name = document.createTextNode(quiz.name);
      quizName.appendChild(name);
      quizDiv.appendChild(quizName);
      quizDiv.id = quiz.id;
      quizDiv.classList.add("quiz");
      document.getElementById("quizList").appendChild(quizDiv);
    });
    document.querySelectorAll(".quiz").forEach(function(quiz) {
      quiz.addEventListener("click", function() {
        getQuiz(quiz.id, 10);
      });
    });
  })
document.getElementById("searchBox").addEventListener("keyup", function() {
  var query = this.value;
  var filter = query.toUpperCase();
  var list = document.getElementById("quizList");
  var quizzes = list.getElementsByTagName("div");
  for (var i = 0; i < quizzes.length; i++) {
    var quizName = quizzes[i].getElementsByTagName("h3")[0];
    if (quizName.innerHTML.toUpperCase().indexOf(filter) > -1) {
      quizzes[i].style.display = "";
    } else {
        quizzes[i].style.display = "none";
    }
  }
});
function getQuiz(id, length) {
  var db = "https://opentdb.com/api.php?";
  var query = db + "amount=" + length + "&category=" + id + "&type=multiple";
  var fetchInit = {
    credentials: "same-origin"
  }
  fetch(query, fetchInit)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        newQuiz(data.results);
      });
}
function newQuiz(questions) {
  var score = 0;
  var count = 0;
  var userChoice;
  var answerIndex;
  
  $("#selectArea, #resultArea").hide();
  $("#startArea").show();
  $("#quizInfo").html(
    questions[count].category + "<br><br>" + questions.length +
    " questions <br><br>"
    );
    
    $("#startQuizBtn").click(function() {
      $("#startArea, #quizInfo, #startQuizBtn").hide();
      $("#quizArea").show();
      updateQuestion();
    });
  }