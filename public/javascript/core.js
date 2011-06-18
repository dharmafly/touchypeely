(function (context, L, reqwest, keypath, document, window) {

  function $(selector, context) {
    var result = (context || document).querySelectorAll(selector);
    return Array.prototype.slice.call(result, 0);
  }
  $.ajax    = reqwest.noConflict();
  $.keypath = keypath.noConflict();

  // http://groups.google.com/group/brightonnewmedia/browse_thread/thread/6356b002dac72c16/9083739868112b05?#9083739868112b05
  var GOOGLE_GEOCODE_URI = 'http://www.google.com/uds/GlocalSearch';

  function getLocation(address, success, error) {
    var params = '?v=1.0&q=' + address + '&callback=?';
    $.ajax({
      url: GOOGLE_GEOCODE_URI + params,
      type: 'jsonp',
      error: error,
      success: function (json) {
        var location = $.keypath(json, 'responseData.results.0');
        if (location) {
          success && success(location.lat, location.lng);
        } else {
          error && error();
        }
      }
    });
  }

  var map = new L.Map('map');

  var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/f1d499e4ec7f4fe099a25b07306432c5/997/256/{z}/{x}/{y}.png',
      cloudmadeAttrib = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
      cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttrib});

  var london = new L.LatLng(51.505, -0.09); // geographical point (longitude and latitude)
  map.setView(london, 13).addLayer(cloudmade);

  (function setupAddressLookup() {
    var addressForm  = $('#form-address')[0],
        addressField = $('#field-address')[0];

    addressForm.addEventListener('submit', function (event) {
      getLocation(addressField.value);
      event.preventDefault();
    }, false);
  })();

})(this, this.L, this.reqwest, this.keypath, this.document, this);
