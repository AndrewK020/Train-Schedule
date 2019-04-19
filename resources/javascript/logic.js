
var config = {
    apiKey: "AIzaSyAkQn3rj5jk2IqNDUe4Efy3bE0sfU0Ae7Q",
    authDomain: "train-schedule-abc88.firebaseapp.com",
    databaseURL: "https://train-schedule-abc88.firebaseio.com",
    projectId: "train-schedule-abc88",
    storageBucket: "train-schedule-abc88.appspot.com",
    messagingSenderId: "990093861781"
  };
  firebase.initializeApp(config);

  var database = firebase.database().ref();

  var scheduleArr = [];



$(document).ready(function() {




    $("#submitBtn").on("click", function(e) {
        e.preventDefault();

        var train = {
            name: $("#name").val().trim(),
            destination: $("#destination").val().trim(),
            time: $("#firstTime").val().trim(),
            frequency: $("#frequency").val().trim(),
        };

        if (isNaN(train.frequency)) {
            $("#frequency").val("");
              Swal.fire({
                type: 'error',
                title: 'Please enter a number for frequency',
              });
        }
        else {
            scheduleArr.push(train);
            database.set(scheduleArr);
            $("#name").val("");
            $("#destination").val("");
            $("#firstTime").val("");
            $("#frequency").val("");
        }
    });



});


function createTable(trainList) {
    
    trainList.forEach(train => {
        var newRow = $("<tr>");

        var name = $("<td>").text(train.name);
        var destination = $("<td>").text(train.destination);
        var frequency = $("<td>").text(train.frequency);
        var nextArrival = $("<td>").text("");
        var minutesAway = $("<td>").text("");

        $(newRow).append(name);
        $(newRow).append(destination);
        $(newRow).append(frequency);
        $(newRow).append(nextArrival);
        $(newRow).append(minutesAway);

        $("#schedule").append(newRow);
    });
}


database.on("value", function(snapshot){
    $("#schedule").empty();
    console.log(snapshot.val());
    scheduleArr = snapshot.val();
    createTable(scheduleArr);
});
