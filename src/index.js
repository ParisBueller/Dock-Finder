

var url = "https://api.openchargemap.io/v2/poi/?output=json&countrycode=US&distance=&distanceunit=miles&maxresults=5&opendata=true&compact=true&verbose=false&includecomments=true&latitude=";
let map;


async function generateMap(searchLocation) { 
    console.log("generateMap fired");
    if(searchLocation) {
      const inputLocation = searchLocation;
      console.log("input", inputLocation);
      const chargeLocations = await fetchChargeLocations(searchLocation);
      console.log(chargeLocations);
      map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
      center: inputLocation
    });
    createMarker(inputLocation, map);
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

    } else {
              //Define promises, which await both the fetchCurrentLocation and fetchChargeLocations to run before running generateMap
        const currentLocation = await fetchCurrentLocation();
        const chargeLocations = await fetchChargeLocations(currentLocation);
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
          center: currentLocation
        });
      
        createMarker(currentLocation, map);
      //Iterate through our response object of charge locations
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



 const createMarker = (pos, map, optionalAddress) => {
   let marker =  new google.maps.Marker({
    position: pos,
    map: map
    });
    
    attachListener(marker, optionalAddress);
 };

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
//Get nearest charging locations based on currentLocation
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




$("#location_form").on("submit", function(e){
  e.preventDefault();
 const location = typeof($("#locationSearch").val()) === "string" && $("#locationSearch").val().trim().length > 0 ? $("#locationSearch").val().trim() : false;
 if(location) {
  fetchInputLocation(location);
 } else {
   alert("missing required fields");
 }
});


const fetchInputLocation = (location) => {
  axios.get('https://maps.googleapis.com/maps/api/geocode/json?', {
    params:{
        address: location,
        key:'AIzaSyCOsF06GdEgLIR_FsdRgCW8o1eoIXHkXnQ'
    }
})
.then(function(response) {
    //log full response
    console.log(response);    

    // //formatted address
    // var formattedAddress = response.data.results[0].formatted_address;  

    // //address components
    // var addressComponents = response.data.results[0].address_components;
  
    //  //formatted address
    var lat = response.data.results[0].geometry.location.lat;  
    var lng = response.data.results[0].geometry.location.lng; 
    generateMap({lat:lat, lng:lng});

   
}).catch(function(error) {
    console.log(error);
})
};