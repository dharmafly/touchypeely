var express = require('express'),
    fs = require('fs'),
    _ = require('underscore'),
    ns = require('express-namespace'),
    request = require('request'),
    db,
    conf,
    app = express.createServer(
      express.logger(),
      express.bodyParser(),
      express.static(__dirname + '/public'),
      express.errorHandler({ dumpExceptions: true, showStack: true })
    //  express.cookieParser(),
    //  express.session({ secret: 'blurbzzz'}),
    );


//load fixtures
fs.readFile(__dirname + '/fixtures.json', function (err, buffer){
  db = JSON.parse(buffer.toString());

  //embed user records in item objects
  _.each(db.items, function (item) {
    var user = _.detect(db.users, function (user) {
      return user.id == item.id;
    }) || {};

    item.user = user;
  });

  if (err){
    throw err;
  }
});

//load config variables
fs.readFile(__dirname + '/conf.json', function (err, buffer){
  conf = JSON.parse(buffer.toString());
});


function nextId(collection){
  return _.max(_.pluck(db[collection], 'id')) + 1;
}

app.get('/login', function(req, res){
  res.render(__dirname + '/views/login.ejs');
});

app.post('/login', function(req, res){
  res.send('Logged in');
});


app.namespace('/api', function () {
  app.get('/count', function(req, res){
    res.send('Hello World, we have '+db.users.length + " users and " + db.items.length + " items in our fake db" );
  });
  // return (paginated) list of all markers
  app.get('/search', function(req, res){
    // req.get
    // Fetch x markers from db
    // Write JSON string to res
     var data = ('type' in req.query) ?
       _.select(db.items, function (item) {
         return item.type === req.query.type;
       }) : db.items;

     res.contentType("application/json");
     res.send(data);
  });

  app.post('/message', function (req, res) {
    var data = {
      uname: conf.txtlocalUserid,
      pword: conf.txtlocalPassword,
      selectednums: '447941192398',
      from: 'TouchyPeely',
      message: req.body.message,
      info: 1,
      test: 0
    };

    var body = '';

    _.each(data, function (value, attribute) {
      var val = attribute === 'message' ? encodeURIComponent(value) : value;
      body += attribute + "=" + val + '&';
    });


    request({
      uri: 'http://www.txtlocal.com/sendsmspost.php?'+body,
      method: 'GET',
      headers: {
        'ContentType': 'application/x-www-form-urlencoded'
      },
      body: ""

    }, function (err, res2, data) {
      res.send(data);
    });
  });

  // Save marker to
  app.post('/items', function(req, res){
    // Authenticate user
    // Validate the data
    // Create a new item model with data
    // return JSON representation of model

    var description = req.body.description,
        user = _.detect(db.users, function (user) {
          return user.id == req.body.user;
        }),
        type = req.body.type,
        createdAt = Date.now(),
        lat = req.body.lat,
        lng = req.body.lng,

        newItem = {
          id: nextId('items'),
          description: description,
          user: user,
          type: type,
          created_at: createdAt,
          lat: lat,
          lng: lng,
          available: true
        };

    db.items.push(newItem);
    res.contentType("application/json");
    res.send(newItem);
  });

  // Update marker to
  app.put('/items/:id', function(req, res){
    // Authenticate user
    // Check item exists
    // Validate the data
    // Update item model with data
    // return JSON representation of model

  });
  // Delete marker
  app.del('/items/:id', function(req, res){
    // Authenticate user
    // Check item exists
    // Delete item
    // Return 204

    var item = _.detect(db.items, function (item, index) {
      return item.id == req.params.id;
    });

    if (item) {
      db.items.splice(parseInt(item.id, 10),1);
    }

    res.send('ok');

  });
});





app.listen(3000);
