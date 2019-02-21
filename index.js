
//Global variables, openchargemap api and map variable
var url = "https://api.openchargemap.io/v2/poi/?output=json&countrycode=US&distance=&distanceunit=miles&maxresults=5&opendata=true&compact=true&verbose=false&includecomments=true&latitude=";
let map;

//Asynchronus function that generates our map
async function generateMap(searchLocation) { 
    //If a location has been input(searchLocation), generate a map
    //and fetch charge locations near the searched location
    if(searchLocation) {
      const inputLocation = searchLocation;
      const chargeLocations = await fetchChargeLocations(searchLocation);
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
      center: inputLocation
    });
    createMarker(inputLocation, map);
    //Iterate through our response object of charge locations
    //And aquire location information
    if(chargeLocations.length > 0){
      chargeLocations.forEach(location => {
        var address = {};
        address.lat = location.AddressInfo.Latitude;
        address.lng = location.AddressInfo.Longitude;
        address.address = location.AddressInfo.AddressLine1;
        address.comments = location.AddressInfo.AccessComments;
        address.distance = location.AddressInfo.Distance;
        address.zip = location.AddressInfo.PostCode;

        //Create a marker for each address in our openChargeMap response
        createMarker({lat:address.lat, lng:address.lng}, map);
      });
    }
    // IF no location search input, generate a map and fetch charge locations
    //based on users current location
    } else {
        //Async await functions that await users current location
        const currentLocation = await fetchCurrentLocation();
        // and the openchargemap response for the nearest charge locations
        const chargeLocations = await fetchChargeLocations(currentLocation);
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
          center: currentLocation
        });
      
        createMarker(currentLocation, map);
        //Iterate through our response object of charge locations
        //And aquire location information
        if(chargeLocations.length > 0){
        chargeLocations.forEach(location => {
          var address = {};
          address.lat = location.AddressInfo.Latitude;
          address.lng = location.AddressInfo.Longitude;
          address.address = location.AddressInfo.AddressLine1;
          address.comments = location.AddressInfo.AccessComments;
          address.distance = location.AddressInfo.Distance;
          address.zip = location.AddressInfo.PostCode;
          
          //Create a marker for each address in our openChargeMap response
         createMarker({lat:address.lat, lng:address.lng}, map, address);
        });
      }
    }
 };


//Create marker function 
 const createMarker = (pos, map, optionalAddress) => {
   let marker =  new google.maps.Marker({
    position: pos,
    map: map
    });
    
    attachListener(marker, optionalAddress);
 };
//A popup modal that offers location information when clicked
const attachListener = (marker, optionalAddress) => {
  marker.addListener("click", function(e){
    $("#markerModalText").html(
      `The address is ${optionalAddress.address} <br>
      The distance is ${optionalAddress.distance.toFixed(2)} Miles`
    );
    $('#exampleModal').appendTo("body").modal('show');
  });
};
//Get current location
const fetchCurrentLocation = function(){
  return new Promise((resolve, reject) => {
      var userPosition = {};
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        userPosition.lat = lat;
        userPosition.lng = lng;
          resolve(userPosition);
        }, (err)=>{
          reject(err);
        });
    }
  });
};
//Ajax call to openchargemap to get nearest charging locations based on currentLocation
const fetchChargeLocations = (currentLocation) => {
  return new Promise((resolve, reject)=>{
    const api = url + currentLocation.lat + "&" + "longitude=" + currentLocation.lng;
      $.ajax ({
        url: api,
        type: 'GET',
        dataType:'JSONP',
        success: data => {    
          resolve(data);
        },
        error:function(err){
          reject(err);
        }
        });
      });
};



//Trim whitespace of input form and prevent default submit
$("#location_form").on("submit", function(e){
  e.preventDefault();
 const location = typeof($("#locationSearch").val()) === "string" && $("#locationSearch").val().trim().length > 0 ? $("#locationSearch").val().trim() : false;
 if(location) {
  fetchInputLocation(location);
 } else {
   alert("missing required fields");
 }
});

// Aquire geocoding information for any searched location via axios
const fetchInputLocation = (location) => {
  axios.get('https://maps.googleapis.com/maps/api/geocode/json?', {
    params:{
        address: location,
        key:'AIzaSyCOsF06GdEgLIR_FsdRgCW8o1eoIXHkXnQ'
    }
})
.then(function(response) {
    var lat = response.data.results[0].geometry.location.lat;  
    var lng = response.data.results[0].geometry.location.lng; 
    generateMap({lat:lat, lng:lng});

   
}).catch(function(error) {
    console.log(error);
})
};