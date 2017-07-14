//Google Maps Yelp Boys Night and Random Events and Outdoor/festival
///////////////////////////////////////////////////////////////////////////////////////////
//GENERAL FLOW
//
//User will enter a query in the form of a location 
//I want to pass that query through maps API (geocoding) to bring up a map of the area in a new div 
//
//
//
//
//
/////////////////////////////////////////////////////////////////////////////////////////


// GOOGLE MAPS GEOCODE-- 
//AIzaSyDmZyph_0mPWdXM8yXSLT669Z_G3lttS_U
//This function gets the info about the city/state that the user enters
//may want to link with yelp api
//call geocode after the form!!!
//geocode();
//get location form
var locationForm = document.getElementById('location-form');

//listen for the submit here 
locationForm.addEventListener('submit', geocode);

    function geocode(event){
        //prevent actual submit
        event.preventDefault();
        var location = document.getElementById('location-input').value;
        axios.get('https://maps.googleapis.com/maps/api/geocode/json?', {
            params:{
                address: location, 
                key:'AIzaSyDmZyph_0mPWdXM8yXSLT669Z_G3lttS_U'
            }

        })
        .then(function(response){
            //logging the full response
            console.log(response);

            //formatting the address from the data object, then dive into array for a single object
            console.log(response.data.results[0].formatted_address);
            var formattedAddress = response.data.results[0].formatted_address;
            //can use back ticks to great a templatte with multiple lines!!!
            var formattedAddressOutput = `
                <ul class="list-group">
                <li class="list-group-item">${formattedAddress}</li>
                </ul>

            `;

            //address components 
            var addressComponents = response.data.results[0].address_components;
            //loop through that array to get the rest of the address info 
            var addressComponentsOutput = '<ul class="list-group">';
            for(var i = 0; i < addressComponents.length; i++){
                //have to add to output variable; also add to template, ${} is just a variable/selector 
                addressComponentsOutput += `
                <li class="list-group-item"><strong>${addressComponents[i].types[0]}</strong>:${addressComponents[i].long_name}</li>
                `;
            }
            addressComponentsOutput += '</ul>';
            //geometry Info
            var lat = response.data.results[0].geometry.location.lat;
            var lng = response.data.results[0].geometry.location.lng;
            var geometryOutput = `<li class="list-group-item"><strong>Latitude</strong>:${lat}</li>
            <li class="list-group-item"><strong>Longitude</strong>:${lng}</li>
            `;

            //output to the mapSpace, address-components,  div
            document.getElementById('mapSpace').innerHTML = formattedAddressOutput;
            document.getElementById('address-components').innerHTML = addressComponentsOutput;
            document.getElementById('geometryInfo').innerHTML = geometryOutput;

        })
        .catch(function(error){
            console.log("error!!!");
        });

        }
//GOOGLE MAPS ADDING MARKERS DYNAMICALLY--MINOR MARKER ISSUE STILL
//has a parameter with callback of initmap choice!!!

    function initMap(){
        //give options for the map, zoom level, where it is supposed to be centered when the user views it too, etc.
        //hardcoding the lat and lng but can change later to take the value from the input box
        var options = {
            //scale of 1(far)-14 (close?)
            zoom: 15,
            //be sure to put the -for lng, otherwise it puts UNC in Afganistan 
            center: {lat:35.9132, lng:-79.0558}
        }

    //have to create the map object next, tkaes 2 parameters here,  also has to be styled or we won't see anything when it loads!!!!
    var map = new google.maps.Map(document.getElementById('map'), options);
        

    //Listen for click on the map AND add a marker whereever that is 
    google.maps.event.addListener(map, 'click', function(event){
        //takes in an object and adds a marker; NOT PERSISTENT HERE
        addMarker({coords:event.latLng});

    });

    // //add a SINGLE marker, it also takes in a parameter in this case 
    // var marker = new google.maps.Marker({
    //     position:{lat:35.9049,lng:-79.0469},
    //     //need a value here (the map created above)
    //     map:map,
    //     //set up url to get to a custom icon?
    //     // icon: 'https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Food-Dome-512.png'
    // });
    // //can pop up text/content info-- neds a listener too
    // var infoWindow = new google.maps.InfoWindow({
    //     content:'<h1>UNC Chapel Hill NC</h1>'

    // });
    // marker.addListener('click',function(){
    //     infoWindow.open(map, marker); 
    // });

    //potential for making coords object (useful if we want to add different types of markers)
    //THIS IS A TEST-- DON'T CALL THESE 3 TIMES LIKE THIS IN FINAL VERSION!!!

    //make an array of markers
    var markers= [

        {
            //UNC 
        coords:{lat:35.9049,lng:-79.0469}, 
        // iconImage:'https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Food-Dome-512.png'
       content:'<h1>UNC</h1>'
    },

        {
            //hot dog place
        coords:{lat:35.9136, lng:-79.0555},
        // iconImage:'https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Food-Dome-512.png'
        content: '<h1>Sup Dogs</h1>'

        },
        {
            //top fo the hill
        coords:{lat:35.9130, lng:-79.0553},
        // iconImage:'https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Food-Dome-512.png'
        content:'<h1>Top of the Hill</h1>'
        }


    ];
//loop through the markers 
    for (var i=0; i<markers.lenth; i++){
        //add marker to all the items in the array 
     addMarker(markers[i]);    
    
    }

    // //UNC coords
    // addMarker({
    //     coords:{lat:35.9049,lng:-79.0469}, 
    //     // iconImage:'https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Food-Dome-512.png'
    //     content:'<h1>UNC</h1>'
    // });
    // //sup dogs coords
    // addMarker({
    //     coords:{lat:35.9136, lng:-79.0555},
    //     // iconImage:'https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Food-Dome-512.png'
    //     content: '<h1>Sup Dogs</h1>'
    // });
    // //top of the hill coords
    // addMarker({
    //     coords:{lat:35.9130, lng:-79.0553},
    //     // iconImage:'https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Food-Dome-512.png'
    //     content:'<h1>Top of the Hill</h1>'
    // });
    //create a function called addMarker so we can add markers dynamically

    function addMarker(coords){
        var marker = new google.maps.Marker({
            //te props makes it a property  with the coords obj
        position:props.coords,
        //need a value here (the map created above)
        map:map,
        //set up url to get to a custom icon? and adds it as a property
        // icon: 'https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Food-Dome-512.png'
        // icon: props.iconImage
        });

        //test to see if a parameter for a custom icon is there
        // if(props.iconImage){
        //     marker.setIcon(props.iconImage);

        //     };

        //check if content
        if(props.content){
                //can pop up text/content info-- neds a listener too
            var infoWindow = new google.maps.InfoWindow({
                content:props.content
                 });

            marker.addListener('click',function(){
                infoWindow.open(map, marker); 
                });

            }

        }

    }



////////////////////////////////////////////////////////////////////////////////////////

//YELP
// var yelpapiKey =
// var yelpqueryURL = "https://api.yelp.com/v3/businesses/search"
// var searchQuery = 
//
//
//calling the search API from YELP       
//     //ajax call 
//     $.ajax({
//         url: (yelpqueryURL + searchQuery + yelpapiKey),
//         method: "GET"
//     }).done(function(response) {
// 	    //see what matches up 
// 	    console.log(response);
// 
///////////////////////////////////////////////////////////////////////////////////////

//EVENTS AND CALLS 
// $(document).ready(function(){
// 	console.log("document is ready");
// 	loadMap();
// 	console.log("map is setting up");
// 	var mapOptions = {
// 		//specificies the location where we want to center the map
// 	 	center:new google.maps.LatLng(17.240498, 82.287598),
// 		 //specifies the zoom level of the map 
// 		 zoom:9,
// 		 //specifies the type of map -- roadmap, satellite (photographic), hybrid(phto plus roads/city names). terrain (Mts, rivers etc.)
// 	 	mapTypeId: google.maps.MapTypeId.ROADMAP
//  };
// 	var map = new google.maps.Map(document.getElementById("mapspace"), mapOptions);
// }
// loadMap();
	
// });

// $(document).ready(function(){

// 	$('a').on('click', function(e){
// 		console.log("you clicked me");
// 	})
// });




///////////////////////////////////////////////////////////////////////////////////////
//TASKS TO FINISH OR QUESTIONS FOR THE GROUP
//1.  What is supposed to be displayed via map?  The city or the location of an actual event etc.? 
//2.  Makign an ajax call via axios (different tech), it is promised-based, I assume it still counts?
//3.  Connect Yelp API to mark businesses-- does it connect with google maps? Check if I can preset the categories from the google doc! Potentially could be markers for those top 5/10







///////////////////////////////////////////////////////////////////////////////////////
//RESOURCES
//
//YELP search keys 
////Client ID
// ImyIU6DHaqlzfq2Y-v7UPw
// Client Secret
// SOC31MI8AVBkGCnk6At0ScKs8qxdhl3CWtDfX7BF1OoTgSPBUbGONwhNb1i8Ozy1
//https://www.youtube.com/watch?v=_nsNs43_ABk
//https://github.com/olalonde/node-yelp

//https://www.yelp.com/developers/documentation/v3/business_reviews
//https://www.yelp.com/developers/documentation/v3/business_search
//http://blog.rapidapi.com/2017/01/05/yelp-fusion-api-profile-pull-local-business-data/
//https://github.com/Yelp/yelp-fusion#code-samples
//https://www.youtube.com/watch?v=dWQ7qBahSMQ
//https://www.youtube.com/watch?v=_nsNs43_ABk
//


//Key Google Maps
//https://developers.google.com/maps/documentation/geocoding/start
//https://developers.google.com/maps/documentation/javascript/
//https://stackoverflow.com/questions/21411358/google-maps-geocoding-a-string
// http://en.marnoto.com/2015/06/aprende-google-maps-geocoding-exemplos.html
// http://www.wikihow.com/Geocode-an-Address-in-Google-Maps-Javascript
//https://hpneo.github.io/gmaps/examples/geocoding.html
//explains what comes back from the response -- revese is entering Lon and Lat
//https://youtu.be/pRiQeo17u6c
//https://github.com/mzabriskie/axios for use with Postman account 
//https://www.youtube.com/watch?v=Zxf1mnP5zcw
//stopped at 12:15
//https://developers.google.com/maps/documentation/javascript/custom-markers





//API Google maps JS API
//AIzaSyDmZyph_0mPWdXM8yXSLT669Z_G3lttS_U

//You already have credentials that are suitable for this purpose
// Server key (auto created by Google Service)
// Key	
// AIzaSyC8nCjKsy9EIVkmqrCTberMfRtiCA_wHQE
// Type	
// None
// Creation date	
// Jul 7, 2017, 9:45:48 PM
// Browser key (auto created by Google Service)

// Key	
// AIzaSyDJBPs135vP7VHNPJKzdMZ39fRMXeyd8dY
// Type	
// None
// Creation date	
// Jul 7, 2017, 