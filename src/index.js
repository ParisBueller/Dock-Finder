
var url = "https://api.openchargemap.io/v2/poi/?output=json&countrycode=US&distance=&distanceunit=miles&maxresults=5&opendata=true&compact=true&verbose=false&includecomments=true&latitude=";

function generateMap() { 
 if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    var api = url + lat + "&" + "longitude=" + lng;
    console.log(api);
    var userPosition = {lat: lat, lng: lng};
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: userPosition
     });
      
     $.ajax ({
     url: api,
     type: 'GET',
     dataType:'JSON',
     success: data => {  
          const user = new google.maps.Marker({
          position: userPosition,
          map: map,
          animation: google.maps.Animation.DROP
          });

           data.forEach(location => {
           var address = {};

           address.lat = location.AddressInfo.Latitude;
           address.lng = location.AddressInfo.Longitude;
           address.address = location.AddressInfo.AddressLine1;
           address.comments = location.AddressInfo.AccessComments;
           address.distance = location.AddressInfo.Distance;
           address.zipCode = location.AddressInfo.Postcode;
           console.log(address.address);

           const docks = new google.maps.Marker({
           position: {lat:address.lat, lng:address.lng},
           map: map
          
       });
     });
   },
     error:error => {
       console.log(error);
       }
     });     
    });
   }     
 };