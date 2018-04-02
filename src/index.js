var lat,lng;
var url = "https://api.openchargemap.io/v2/poi/?output=json&countrycode=US&distance=&distanceunit=miles&maxresults=5&opendata=true&compact=true&verbose=false&includecomments=true&latitude=";

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
    var userMarker = new google.maps.Marker({
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
    dataType:'JSON',
    success: data => {
      //Results go from closest(0) to furthest(4) away from user's current position
       var addressOne = data[0]['AddressInfo'];
       var addressTwo = data[1]['AddressInfo'];
       var addressThree = data[2]['AddressInfo'];
       var addressFour = data[3]['AddressInfo'];
       var addressFive = data[4]['AddressInfo'];
      
        
      console.log(addressOne.Latitude);
      console.log(addressOne.Longitude);
      //console.log(addressTwo);
   
    
    }
  })  
}