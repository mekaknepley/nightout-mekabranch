var config = {
    apiKey: "AIzaSyDJBPs135vP7VHNPJKzdMZ39fRMXeyd8dY",
    authDomain: "nightout-81410.firebaseapp.com",
    databaseURL: "https://nightout-81410.firebaseio.com",
    projectId: "nightout-81410",
    storageBucket: "nightout-81410.appspot.com",
    messagingSenderId: "1000413859626"
  };

var userCity = "";
var firebaseUser;

//api.openweathermap.org/data/2.5/weather?q={city name}

firebase.initializeApp(config);

// Create a variable to reference the database.
var database = firebase.database();

function printUserCity() {
    $("#preferredCity").html("City: " + userCity);
    $("#weather").html("");
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    console.log(user);
    firebaseUser = user;

    // Try to read preferred city
    database.ref('/users/' + firebaseUser.uid).once('value').then(function(snapshot) {
       userCity = snapshot.val().city;
       printUserCity();
    });

    // Hide all sign in and sign up
    $(".omb_login").hide();

    // Show logout button
    $(".omb_logout").show();
    
  } else {
    // No user is signed in.

    $(".omb_logout").hide();
    $(".omb_login").show();
  }
});

$("#eventBriteButton").click(function(){
    var token = "R6QQVF4RQTZXWE5XVPC5";
    // https://www.eventbriteapi.com/v3/events/search/?location.address=Raleigh&token=R6QQVF4RQTZXWE5XVPC5
    var queryURL = `https://www.eventbriteapi.com/v3/events/search/?location.address=${userCity}&start_date.keyword=today&token=${token}`;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(data){
        console.log(data);
        $("#eventBriteDescription0").html(data.events[0].name.html);
        $("#eventBriteDescription1").html(data.events[1].name.html);
        $("#eventBriteDescription2").html(data.events[2].name.html);
    });
});

$("#signUpButton").click(function(){
    var email = $("#emailInput").val().trim();
    var password = $("#passwordInput").val().trim();
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
  // ...
    });

});

$("#signOut").click(function(){
    firebase.auth().signOut().then(function() {
    // Sign-out successful.
    firebaseUser = undefined;
    }).catch(function(error) {
    // An error happened.
    });
});

$("#signInForm").submit(function(event){
    event.preventDefault();
    var email = $("#emailInput").val().trim();
    var password = $("#passwordInput").val().trim();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // ...
});
});

$("#signInFaceBook").click(function(){
    var provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // ...
}).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  // ...
});

});

$("#signInTwitter").click(function(){
    var provider = new firebase.auth.TwitterAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        var token = result.credential.accessToken;
        var secret = result.credential.secret;
        // The signed-in user info.
        var user = result.user;
        // ...
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
});

$("#signInGoogle").click(function(){
    var provider = new firebase.auth.GoogleAuthProvider();
    //provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;

        // ...
        console.log("signed in with google");
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });
});

$("#cityInputForm").submit(function(){
    event.preventDefault();
    userCity = $("#cityInput").val().trim();
    printUserCity();

    if (firebaseUser != undefined) {
        database.ref("users/" + firebaseUser.uid).set({
            city: userCity
        });
    }
});

$("#weatherButton").click(function(){
    //api.openweathermap.org/data/2.5/weather?q={city name}
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + userCity +
    "&units=imperial&APPID=1f696d92481f8b09a45310a970c0b486";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(data){
        console.log(data);
        console.log(data.main.temp);
        console.log(data.weather[0].description);
        //http://openweathermap.org/img/w/10d.png
        var weatherHtml = `The weather is ${data.main.temp} F <img src='http://openweathermap.org/img/w/${data.weather[0].icon}.png' alt='${data.weather[0].description}'>`;
        $("#weather").html(weatherHtml);
    });
});

// $(".dateNightButton").click(function(){

// })

// Client ID
// ImyIU6DHaqlzfq2Y-v7UPw
// Client Secret
// SOC31MI8AVBkGCnk6At0ScKs8qxdhl3CWtDfX7BF1OoTgSPBUbGONwhNb1i8Ozy1

$(".dateNightButton").click(function(){
    var queryURL = "";
});


//  function signOut() {
//     var auth2 = gapi.auth2.getAuthInstance();
//     auth2.signOut().then(function () {
//       console.log('User signed out.');
//     });
//   }


// var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");
// ref.onAuth(function(authData) {
//   if (authData && isNewUser) {
//     // save the user's profile into Firebase so we can list users,
//     // use them in Security and Firebase Rules, and show profiles
//     ref.child("users").child(authData.uid).set({
//       provider: authData.provider,
//       name: getName(authData)
//     });
//   }
// });
