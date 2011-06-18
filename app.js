var express = require('express'),
    fs = require('fs'),
    app = express.createServer();

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.send('Hello World');  
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

app.listen(3000);
