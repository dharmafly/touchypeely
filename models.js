/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    mongooseAuth = require('mongoose-auth'),
    sys = require('sys'),
    Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/touchypeely');

/*
* Model schemas definitions
*
*
*/

var UserSchema = new Schema ({
    email: String,
    name: String,
    created_at: { type: Date, default: Date.now }
  }),

/*
 * Common schema used for both compost buckets and heaps
 *
 */

  ItemSchema = new Schema ({
    description: String,
    type: {type: String, validate: /^(bucket|heap)$/},
    lat: Number,
    lng: Number,
    size: Number,
    user: String,
    available: {type: Boolean, default: true},
    created_at: {type: Date, default: Date.now }
  }),
  User,
  Item;

//decorate account scheme with the mongoose-auth attributes
UserSchema.plugin(mongooseAuth, {
  everymodule: {
    everyauth: {
      User: function () {
        console.info("Returning user...");
        return User;
      }
    }
  },

  password: {
    loginWith: 'email',

    everyauth: {
      getLoginPath: '/login',
      postLoginPath: '/login',
      loginView: 'login.jade',
      getRegisterPath: '/register',
      postRegisterPath: '/register',
      registerView: 'register.jade',
      loginSuccessRedirect: '/',
      registerSuccessRedirect: '/'
    }
  }
});

mongoose.model('Item', ItemSchema);
mongoose.model('User', UserSchema);


Item = mongoose.model('Item', ItemSchema);
User = mongoose.model('User', UserSchema);


module.exports = {};
module.exports.User = Item;
module.exports.Item = User;


/*
var bucket = new Item({type: 'bucket'});

bucket.description = "hi there";
bucket.save(function(err){
  console.info('Saved post');
});

Item.find({type: 'bucket'}, function (err, docs) {
  docs.forEach(function (doc) {
    console.info("bucket description: %s", doc.description);

    doc.remove( function(err) {
      console.info('doc removed');
    });

  });
});
*/
