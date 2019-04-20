
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

    //delete button
    $(document).on("click", ".fas", function() { 
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            
            if (result.value) {
                let index = $(this).attr("index");
                scheduleArr.splice(index,1);
                database.set(scheduleArr);
               
                Swal.fire(
                    'Deleted!',
                    'The train has been deleted.',
                    'success'
                );
            }
          })
    })
});



function createTable(trainList) {
    $("#schedule").empty();

    trainList.forEach(train => {
        var futureTimes = getNextArrival(train);

        var newRow = $("<tr>");

        var name = $("<td>").text(train.name);
        var destination = $("<td>").text(train.destination);
        var frequency = $("<td>").text(train.frequency);
        var nextArrival = $("<td>").text(futureTimes.nextArrival);
        var minutesAway = $("<td>").text(futureTimes.minutesAway);
        var deletBtn = $("<i class='fas fa-times'></i>").attr("index", trainList.indexOf(train));

        $(newRow).append(name);
        $(newRow).append(destination);
        $(newRow).append(frequency);
        $(newRow).append(nextArrival);
        $(newRow).append(minutesAway);
        $(newRow).append(deletBtn);

        $("#schedule").append(newRow);
        
    });
}



database.on("value", function(snapshot){
    scheduleArr = snapshot.val();
    createTable(scheduleArr);
});


function getNextArrival(getTrain) {

    var currentTime = moment();
    var startTime = getTrain.time;
    var timeBetween = moment.utc(moment(currentTime, "HH:mm").diff(moment(startTime, "HH:mm")));
    
    var minutes = (moment(timeBetween).hour()*60 + timeBetween.minutes());

    var lastArrival = moment(startTime, "HH:mm");
    
    while (minutes > getTrain.frequency) {
        minutes = minutes - getTrain.frequency;
        lastArrival = moment(lastArrival).add(getTrain.frequency, "minutes");
        
    }

    var nextMoment = moment(lastArrival).add(getTrain.frequency, "minutes");
    var nextArrival = nextMoment.format("hh:mm a");
    var time = moment(currentTime).format("hh:mm a");

    if (time === nextArrival) {
        var minutesAway = 0;
    }

    else {
        var minutesAway = moment(moment(nextMoment).diff(moment(currentTime)));
        minutesAway = moment(minutesAway).minutes() + 1;
    }
    
    return time = {
        nextArrival: nextArrival,
        minutesAway: minutesAway
    };

}