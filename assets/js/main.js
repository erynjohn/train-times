
$(document).ready(function () {
    
    //Initialize Firebase
    var config = {
        apiKey: "AIzaSyDZUB5ygACv1B1jaJUyekKs56MFVS_5dck",
        authDomain: "ebaylike-57f59.firebaseapp.com",
        databaseURL: "https://ebaylike-57f59.firebaseio.com",
        projectId: "ebaylike-57f59",
        storageBucket: "ebaylike-57f59.appspot.com",
        messagingSenderId: "419760624718"
    };
    
    firebase.initializeApp(config);
    // Initialize Cloud Firestore through Firebase
    var firestore = firebase.firestore();
    var database = firebase.database();

    //save database reference 
    const trainCollection = firestore.collection("train-schedule");
    

    

    //Update button function
    $('.save-button').on('click', function (event) {
        $('train-table').empty();
        event.preventDefault();
        //takes in form inputs
        var timetable = {
            name: $('.name-input').val(),
            destination: $('.destination-input').val(),
            frequency: $('.frequency-input').val(),
            timeGive: $('.next-train-input').val(),
        }

        // Add new documents with a generated id.
        var addDoc = firestore
            .collection('train-schedule')
            .add({ timetable })
            .then(function (ref) {
                try {
                    console.log("Status- Saved with ID: ", ref.id);
                } catch (error) {
                    console.log("Got an error", error);
                }
            });
    });

    trainCollection.orderBy('destination').onSnapshot(snapshot => {
        var changes = snapshot.docChanges();
        changes.forEach(change => {
            console.log(changes);
        });
    });
    //create table data function
    function createTableData(doc) {
        $(".train-table").append(
            "<tr id= '$trId'><td id='name-col'>" + doc.name +
            "<td id='destination-col'>" + doc.destination+ "</td></tr>");
   
    }

    trainCollection.orderBy('timetable.name').onSnapshot(snapshot => {
        var changes = snapshot.docChanges();
        
        changes.forEach(change => {
            if(change.type == 'added') {
                createTableData(change.doc.data().timetable);
                // takes care of the time
                var firstTrainTime = parseInt(change.doc.data().timetable.timeGive);
                var frequency = parseInt(change.doc.data().timetable.frequency)
					    var firstTimeConverted = moment(firstTrainTime, "HH:mm ");
						var timeNow = moment();
						console.log('Current time '+moment(timeNow).format('HH:mm '));
						var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
						var timeDiff = diffTime % frequency;
                        var nextArrival = frequency - timeDiff;
						console.log('frequency ' + nextArrival+' minutes');
					    var nextTrain = moment().add(nextArrival, "minutes");
                        console.log("Train arrives at "+moment(nextTrain).format("HH:mm"));

                        $(".train-tableTimes").append(
                            "<tr id=secondTr><td id='next-arrival'>" +nextTrain.format("HH:mm") +
                            "<td>" +frequency+ "</td></tr>");            
                      
                        
                

        
            } else if(change.type == 'removed') {
                trainCollection.doc('[data-id=' +change.doc.id+ ']').delete().then(function(){
                    setInterval('window.location.reload()');
                console.log("document removed")
                }).catch(function(error) {
                    console.error("Error removing document ", error);
                })
            }
        })
    })
            	
     



});
