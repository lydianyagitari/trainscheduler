//initializing firebase
var config = {
    apiKey: "AIzaSyD53NG2_bOYgcPDaT9lXkD_8UAXThCkTSE",
    authDomain: "trainscheduler-d1a26.firebaseapp.com",
    databaseURL: "https://trainscheduler-d1a26.firebaseio.com",
    projectId: "trainscheduler-d1a26",
    storageBucket: "",
    messagingSenderId: "1046869280955"
};
firebase.initializeApp(config);


var database = firebase.database().ref();
//On click function for train name, destination, first train and frequency
$("#add").on("click", function (event) {
    var Train_Name = $("#Train_Name").val();
    var destination = $("#destination").val();
    var firstTrain = $("#firstTrain").val();
    var frequency = $("#frequency").val()
    writeUserData(Train_Name, destination, firstTrain, frequency)

})
// Writing to firebase 

function writeUserData(Train_Name, destination, firstTrain, frequency) {
    database.push({
        Train_Name: Train_Name,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
    })
}
//3. Read from database and show
function test() {
    $("#rate").empty()
    database.on("child_added", function (snapshot) {

        //moments
        var currentTime = moment(moment(), 'dd:hh:mm:ss a')
        var firstTrain = moment(snapshot.val().firstTrain, 'dd:hh:mm:ss a')


        var frequency = snapshot.val().frequency;
        var totalMinutes = currentTime.diff(firstTrain, "minutes")

        console.log("firstTrain :" + moment(firstTrain).format('hh:mm a'))
        console.log("totalminutes :" + totalMinutes)
        var mod = (totalMinutes % frequency)
        if (mod < 0) {
            mod = mod * (-1)
        }
        console.log("mod : " + mod)
        var addMinutes = frequency - mod
        console.log("addMinutes : " + addMinutes)
        var nextTrain = moment().add(addMinutes, 'minutes').format('hh:mm a');
        console.log(nextTrain)
        //intervals of train times
        $("#rate").append(("<tr> " +
            " <td> " + snapshot.val().Train_Name + " </td> " +
            " <td> " + snapshot.val().destination + " </td> " +
            " <td> " + frequency + " </td> " +
            " <td> " + nextTrain + " </td> " +
            " <td> " + addMinutes + "</td> "));

    })
}
//function for start time
function startTime() {
    var today = new moment().format('h:mm:ss a')
    // document.getElementById('time').innerHTML = h + ":" + m + ":" + s;
    $("#time").text('Current Time : ' + today)
    t = setTimeout(function () {
        startTime()
        test()
    }, 1000);
}
startTime();
test()