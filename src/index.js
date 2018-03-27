var lat,lng;
var url = "https://api.openchargemap.io/v2/poi/?output=json&countrycode=US&distance=&distanceunit=miles&maxresults=10&compact=true&verbose=false&latitude=";


//Obtain users current location in latitude and longitude
$(document).ready(function(){
    if(navigator.geolocation) {      navigator.geolocation.getCurrentPosition(function(position){
            lat = position.coords.latitude;
            console.log(lat);
            lng = position.coords.longitude;
            console.log(lng);
            initMap(lat,lng);
            findDock(lat,lng);
        })     
    }  
})
//Initialize map with current location marker
function initMap(lat,lng) {  
    var userPosition = {lat: lat, lng: lng};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: userPosition
    });
    var marker = new google.maps.Marker({
       position: userPosition,
       map: map
   });
}
//Find closest charging dock
function findDock(lat,lng) {
  var api = url + lat + "&" + "longitude=" + lng;
  console.log(api);
  $.ajax ({
    url: api,
    type: 'GET',
    success: function(response) {
    console.log(response[2,0]);
    }
  })  
}