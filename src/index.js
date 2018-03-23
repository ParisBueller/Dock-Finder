var lat,lng;
var latitude;
var longitude;

$(document).ready(function(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            lat = position.coords.latitude;
            lng = position.coords.longitude;
            initMap(lat,lng);
        })     
    }  
})

function initMap(lat,lng) {
    var latitude = parseInt(lat);
    console.log(latitude);
    var longitude = parseInt(lng);
    console.log(longitude);
    var userPosition = {lat: latitude, lng: longitude};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: userPosition
    });
    var marker = new google.maps.Marker({
        position: userPosition,
        map: map
    });
}