

var url = "https://api.openchargemap.io/v2/poi/?output=json&countrycode=US&distance=&distanceunit=miles&maxresults=5&opendata=true&compact=true&verbose=false&includecomments=true&latitude=";
let map;
async function generateMap() { 
    console.log("generateMap fired");
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
          createMarker({lat:address.lat, lng:address.lng}, map);
        
        });
      }

 };

 const createMarker = (pos, map) => {
   return new google.maps.Marker({
    position: pos,
    map: map
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
