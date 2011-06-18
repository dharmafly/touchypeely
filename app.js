var express = require('express'),
    fs = require('fs'),
    _ = require('underscore'),
    db,
    app = express.createServer(
      express.logger(),
      express.bodyParser(),
      express.static(__dirname + '/public'),
      express.errorHandler({ dumpExceptions: true, showStack: true })
    //  express.cookieParser(),
    //  express.session({ secret: 'blurbzzz'}),
    );


//load fakedb

fs.readFile(__dirname + '/fixtures.json', function (err, buffer){
  db = JSON.parse(buffer.toString());

  if (err){
    throw err;
  }
});


app.get('/', function(req, res){
  res.send('Hello World, we have '+db.users.length + " users and " + db.items.length + " items in our fake db" );
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
   var data = req.query.type ?
     _.select(db.items, function (item) {
       return item.type === req.query.type;
     }) : db.items;

   res.contentType("application/json");
   res.send(db.items);
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


app.listen(3000);
