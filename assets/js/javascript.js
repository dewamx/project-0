$(document).ready(function () {
  console.log("ready!");
  $("#startArea, #quizArea, #resultArea, #alertArea").hide();
  // Append quiz categories to quiz select area
  fetch("https://opentdb.com/api_category.php")
      .then(function (response) {
          // console.log(response);
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
          // select.append(option);
          // form.append(select);
          // $('.card-body').append(form)

          // Add event listeners to each quiz in the selection area
          document.querySelectorAll(".quiz").forEach(function (quiz) {
              quiz.addEventListener("click", function () {
                  getQuiz(quiz.id, 10); // Starts a new quiz - 10 questions long by default
              });
          });
      })
      .catch(function (response) {
          onFetchError(response);
      });
  // Gets questions and passes results to newQuiz() function
  function getQuiz(id, length) { // Takes length of quiz and category ID
      var db = "https://opentdb.com/api.php?";
      var query = db + "amount=" + length + "&category=" + id + "&type=multiple";
      var fetchInit = {
          credentials: "same-origin"
      }
      fetch(query, fetchInit)
          .then(function (response) {
              return response.json();
          })
          .then(function (data) {
              newQuiz(data.results); // Start new quiz with data on success
          })
          .catch(function (error) {
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
      $("#selectArea, #question, #answerList, #quizArea, #resultArea, #quizList").hide();
      $("#startArea").show();
      $("#quizInfo").html(
          questions[count].category + "<br><br>" + questions.length +
          " questions <br><br>"
      );
      $("#startQuizBtn").click(function () {
          $("#startArea, #quizInfo, #startQuizBtn, #quizList, #dDown").hide();
          $("#quizArea, #answerList, #question").show();
          updateQuestion();
      });
      document.querySelector("#answerList").addEventListener("click", function () {
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
      $("#nextBtn").click(function () {
          var answers = document.getElementsByClassName("answer");
          if (userChoice == answerIndex) {
              answers[userChoice].classList.add("correctAnswer");
              score++;
          } else {
              answers[userChoice].classList.add("incorrectAnswer");
              answers[answerIndex].classList.add("correctAnswer");
          }
          count++;
          setTimeout(function () {
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
          questions[count].incorrect_answers.forEach(function (answer) {
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

      function choose() {
          var x;
          if (score > 5) {
              x = "good";
          } else {
              x = "bad";
          };
          console.log(x);
          // Storing our giphy API URL for a random cat image
          var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + x + "&api_key=6i8465EmvLT6p8JghEdbV6GWCHHbUb6S";

          // Perfoming an AJAX GET request to our queryURL
          $.ajax({
              url: queryURL,
              method: "GET"
          })

              // After the data from the AJAX request comes back
              .then(function (response) {

                  // Saving the image_original_url property
                  var imageUrl = response.data[0].images.downsized.url;

                  // Creating and storing an image tag
                  var goodImage = $("<img>");

                  // Setting the catImage src attribute to imageUrl
                  goodImage.attr("src", imageUrl);
                  goodImage.attr("alt", "cat image");

                  // Prepending the catImage to the images div
                  $("#result").prepend(goodImage);
              });

      };
      function showResult() {
          choose();
          $("#quizArea").hide();
          $("#resultArea").show();
          $("#result").html("You scored " + score + " out of " + questions.length);
      }
  }
});