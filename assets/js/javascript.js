$("#startArea, #quizArea, #resultArea, #alertArea").hide();

// Append quiz categories to quiz select area
fetch("https://opentdb.com/api_category.php")
  .then(function(response) {
    return response.json();
  })
  
  .then(function(data) { // Create list of quiz categories in select area
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
   

    // Add event listeners to each quiz in the selection area
    document.querySelectorAll(".quiz").forEach(function(quiz) {
      quiz.addEventListener("click", function() {
        getQuiz(quiz.id, 10); // Starts a new quiz - 10 questions long by default
      });
    });

  })
  .catch(function(response) {
    onFetchError(response);
  });


// Handles fetch errors
function onFetchError(response) {
  $("#selectArea, #startArea, #quizArea, #resultArea").hide();
  $("#alertArea").show();
  $(".alert").html(
    "Oops. We were unable to retrieve any quiz data.<br><br>" +
    "<h6><a href='#'>Please contact an administrator</a></h6>"
  );
}

// Add event listener to search box so search function triggered on key up
document.getElementById("searchBox").addEventListener("keyup", function() {
  var query = this.value; // Search input
  var filter = query.toUpperCase();
  var list = document.getElementById("quizList");
  var quizzes = list.getElementsByTagName("div"); // All the quizzes

  for (var i = 0; i < quizzes.length; i++) {
    var quizName = quizzes[i].getElementsByTagName("h3")[0];
    if (quizName.innerHTML.toUpperCase().indexOf(filter) > -1) {
      quizzes[i].style.display = "";
    } else {
        quizzes[i].style.display = "none";
    }
  }
});

// Gets questions and passes results to newQuiz() function
function getQuiz(id, length) { // Takes length of quiz and category ID
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
      newQuiz(data.results); // Start new quiz with data on success
    })
    .catch(function(error) {
      onFetchError(error);
    });
}

function newQuiz(questions) {
  var score = 0;
  var count = 0;
  var userChoice; // Stores users choice as the index of the selected answer in the array of all possible answers
  var answerIndex; // Stores the index of the correct answer in the array of all possible answers
                   // Both variables compared when the user clicks next button. Score incremented if they match

  // Hide the current area and show the quiz start area
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


  document.querySelector("#answerList").addEventListener("click", function() {
    var answers = document.getElementsByClassName("answer");
    if (event.target.id == "answerList") {
      return;
    }
    for (var i = 0; i < answers.length; i++) {
      if (answers[i].classList.contains("selectedAnswer")) {
        answers[i].classList.remove("selectedAnswer");
      }
    }
    event.target.classList.add("selectedAnswer");
    userChoice = event.target.id;
  });

  $("#nextBtn").click(function() {
    var answers = document.getElementsByClassName("answer");
    if (userChoice == answerIndex) {
      answers[userChoice].classList.add("correctAnswer");
      score++;
    } else {
        answers[userChoice].classList.add("incorrectAnswer");
        answers[answerIndex].classList.add("correctAnswer");
    }
    count++;
    setTimeout(function() {
      if (count < questions.length) {
        updateQuestion();
      } else {
          showResult();
      }
    }, 2000);
  });

  function updateQuestion() {
    var allAnswers = [];
    var correctAnswer = questions[count].correct_answer;
    $("#answerList").empty();

    questions[count].incorrect_answers.forEach(function(answer) {
      allAnswers.push(answer);
    });

    // Push correct answer into array at random index
    allAnswers.join();
    allAnswers.splice(Math.floor(Math.random() * 4), 0, correctAnswer);
    allAnswers.join();

    // Record the index of the correct answer in the array so it can be compared with the index of users choice
    answerIndex = allAnswers.indexOf(correctAnswer);

    $("#question").html(questions[count].question);
    for (var i = 0; i < allAnswers.length; i++) { // Loop through answers and append each to list
      var li = document.createElement("li");
      var text = document.createTextNode(decodeHTML(allAnswers[i]));
      li.appendChild(text);
      li.classList.add("answer");
      li.id = i;
      document.getElementById("answerList").appendChild(li);
    }

    function decodeHTML(html) {
      var text = document.createElement("textarea");
      text.innerHTML = html;
      return text.value;
    }
  }

  function showResult() {
    $("#quizArea").hide();
    $("#resultArea").show();
    $("#result").html("You scored " + score + " out of " + questions.length);
  }
}
