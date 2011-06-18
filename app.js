var express = require('express'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    everyauth = require('everyauth'),
    mongooseAuth = require('mongoose-auth'),
    models = require('./models'),
    User = models.User,
    Item = models.Item,

    app = express.createServer(
      express.bodyParser(),
      express.static(__dirname + '/public'),
      express.cookieParser(),
      express.session({ secret: 'blurbzzz'}),
      mongooseAuth.middleware()
    );


everyauth.debug = true;

app.get('/', function(req, res){
  res.send('Hello World');
});

app.get('/login', function(req, res){
  res.render(__dirname + '/views/login.ejs');
});

app.post('/login', function(req, res){
  res.send('Logged in');
});

// return (paginated) list of all markers
app.get('/search', function(req, res){
  // req.get
  // Fetch x markers from db
  // Write JSON string to res

  fs.readFile(__dirname + '/mocks/item.json', function(err, buffer){
    var mock, items;

    if (err){
      throw err;
    }
    mock = JSON.parse(buffer.toString());
    items = [mock];
    res.send(items);
  });
});

// Save marker to 
app.post('/items', function(req, res){
  // Authenticate user
  // Validate the data
  // Create a new item model with data
  // return JSON representation of model
});

// Update marker to 
app.put('/items/:id', function(req, res){
  // Authenticate user
  // Check item exists
  // Validate the data
  // Update item model with data
  // return JSON representation of model
});

// Delete marker to 
app.del('/items/:id', function(req, res){
  // Authenticate user
  // Check item exists
  // Delete item
  // Return 204
});


mongooseAuth.helpExpress(app);
app.listen(3000);
