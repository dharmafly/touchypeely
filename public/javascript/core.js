(function (context, L, $, jQuery, keypath, tim, document, window) {
  var GOOGLE_GEOCODE_URI = 'http://www.google.com/uds/GlocalSearch',
      SEARCH_URI = '/api/search',
      CREATE_URI = '/api/items',
      SEND_MESSAGE_URI = '/api/message',
      CENTRE = new L.LatLng(50.825945228670115, -0.14792919158935547),
      THE_GUARDIAN = new L.LatLng(51.535044513278166, -0.12205123901367188),
      lang = {
        COULD_NOT_LOCATE: "Sorry, we couldn't find that.",
        PLEASE_ENTER_LOCATION: 'Please enter a location.'
      },
      
      ItemIcon = L.Icon.extend({
        shadowUrl: '/images/marker-item-shadow.png',
        iconSize: new L.Point(36, 42),
        shadowSize: new L.Point(41, 47),
        iconAnchor: new L.Point(18, 42),
        popupAnchor: new L.Point(3, -39)
      }),      
      BucketIcon = ItemIcon.extend({
        iconUrl: '/images/marker-peelings.png'
      }),
      HeapIcon = ItemIcon.extend({
        iconUrl: '/images/marker-heap.png'
      }),
      AddItemIcon = L.Icon.extend({
        iconUrl: '/images/marker-add.png',
        shadowUrl: '/images/marker-item-shadow.png'
      }),
      
      mapElem = $("#map"),
      map,
      LOGGED_IN_USERID = "5";
      
  // Console logging
  window.O = function(){
    if (window.console){
      window.console.log.apply(window.console, arguments);
    }
  };
       
  // http://groups.google.com/group/brightonnewmedia/browse_thread/thread/6356b002dac72c16/9083739868112b05?#9083739868112b05
  // NOTE: officially deprecated by Google and should be modified here
  function getLocation(address, callback) {
    var params = '?v=1.0&q=' + address + '&callback=?';
    $.getJSON(GOOGLE_GEOCODE_URI + params, function(json) {
      var location = keypath(json, 'responseData.results.0');
      
      if (location) {
        callback(location.lat, location.lng);
      }
      else {
        callback(false);
      }
    });
  }
  
  function createMap(){
    var map = new L.Map('map', {scrollWheelZoom: false}),
      cloudemadeApiKey = 'f1d499e4ec7f4fe099a25b07306432c5',
      cloudmadeUrl = 'http://{s}.tile.cloudmade.com/' + cloudemadeApiKey + '/997/256/{z}/{x}/{y}.png',
      cloudmadeAttrib = 'Map data: <a href="http://www.openstreetmap.org">OpenStreetMap</a>',
      cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttrib});
      
      map.addLayer(cloudmade);
      return map;
  }
  
  function setupAddressLookup() {
    var addressForm  = $('#form-address'),
        addressField = $('#field-address'),
        report = $('#form-address-report');

    addressForm.submit(function (event) {
      var adr = addressField.val();
      
      report.text();
      
      if (adr){
        getLocation(adr, function(lat, lng){
          var latlng;
          
          if (lat !== false){
            latlng = new L.LatLng(parseFloat(lat), parseFloat(lng));
            map.setView(latlng, 14);
          }
          else {
            report.text(lang.COULD_NOT_LOCATE);
          }
        });
      }
      
      else {
        report.text(lang.PLEASE_ENTER_LOCATION);
      }
      
      event.preventDefault();
    });
  }
  
  function addMarker(markerLocation, options){
    var marker = new L.Marker(markerLocation, options);
    map.addLayer(marker);
    return marker;
  }
  
  function requestSendMsg(msg){
    $.post(SEND_MESSAGE_URI, {message:msg});
  }
  
  function onClickMarker(event){
    var marker = event.target,
        popupContents = tim('marker-item-details', marker.options.touchpeely_item),
        popupElem = $(popupContents);
        
    function setContentsToItemDetails(){
      var popupContents = tim('marker-item-details', marker.options.touchpeely_item),
          popupElem = $(popupContents);
          
      popupElem.find('button').one('click', setContentsToSendMsg);
      marker.bindPopup(popupElem[0]).openPopup();
    }
    
    function setContentsToSendMsg(){
      var popupContents = tim('marker-send-msg'),
          popupElem = $(popupContents);
          
      popupElem.find('button').one('click', setContentsToMsgSent);
      marker.bindPopup(popupElem[0]).openPopup();
    }
    
    function setContentsToMsgSent(){
      var popupContents = tim('marker-msg-sent'),
          popupElem = $(popupContents);
          
      marker.bindPopup(popupElem[0]).openPopup();
    }
    
    setContentsToItemDetails();
  }
  
  function addItemToMap(item){
    var icon = item.type === 'bucket' ? new BucketIcon() : new HeapIcon(),
        latlng = new L.LatLng(parseFloat(item.lat), parseFloat(item.lng)),
        marker = addMarker(latlng, {icon:icon, touchpeely_item:item});
  
    marker.on('click', onClickMarker);
  }
  
  function getItems(){
    $.getJSON(SEARCH_URI, function(items){
      $.each(items, function(key, item){
        addItemToMap(item);
      });
    });
  }
  
  function postItem(data, callback) {
    $.post(CREATE_URI, data, callback);
  }
  
  function setupCreateItem(){
    map.on('click', function(event){
      var marker = addMarker(event.latlng, {icon: new AddItemIcon(), draggable:true}),
          itemData = {user: LOGGED_IN_USERID};
      
      function displayAddItem(){
        var popupContents = tim('marker-add-item'),
            popupElem = $(popupContents);
      
        popupElem.find('a').one('click', displayEditItem);
        marker.bindPopup(popupElem[0]).openPopup();
      }
      
      function displayEditItem(event){
        var popupContents = tim('marker-edit-item'),
            popupElem = $(popupContents);
            
        itemData.type = event.target.hash.replace('#', '');
        
        popupElem.find('button').one('click', function(){
          itemData.description = popupElem.find('textarea').val();
          itemData.size = popupElem.find('input[type=range]').val();
          createItem();
        });
        marker.bindPopup(popupElem[0]).openPopup();
        event.preventDefault();
      }
      
      function createItem(){
        var latlng = marker.getLatLng();
               
        itemData.lat = parseFloat(latlng.lat);
        itemData.lng = parseFloat(latlng.lng);
        
        postItem(itemData, function(item){
          marker.closePopup();
          map.removeLayer(marker);
          addItemToMap(item);
        });
        
        requestSendMsg(itemData.description);
      }
      
      marker.on('click', displayAddItem);
      marker.on('dragend', displayAddItem);
    });
  }
    
  $('.leaflet-control-fullscreen').click(function (event) {
    var body = $('body');
    body.toggleClass('map-fullscreen', !body.hasClass('map-fullscreen'));
    map.invalidateSize();
    event.preventDefault();
  });
  
  /////

  window.map = map = createMap();
  setupAddressLookup();
  setupCreateItem();
  map.setView(THE_GUARDIAN, 14);
  getItems();
  

})(this, this.L, this.$, this.jQuery, this.keypath, this.tim, this.document, this);
