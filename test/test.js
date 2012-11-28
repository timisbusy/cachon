var redis = require('redis');
var Cachon = require('../index');

// setup redis client

var client = redis.createClient();

var options = {
  selectDB: 2
};

client.on('ready', function () {
  client.select(options.selectDB, function (err) {
    if (err) {
      console.log('error selecting db: ', options.selectDB);
      console.log(err);
      error = err;
    }
    console.log("selectedDB: ", options.selectDB);
  });
});

// set up cachon

var cache = new Cachon(client);

// create our test key if it doesn't exist
// NOTE: The key must be enough to tell the function what to create.
//       The other option would be to create a closure.

function createTest (key, cb) {
  cache.setWithExpiry(key, 60, "test_" + key, cb);
}

// use cachon to get or create the value

cache.getOrCreate("test", createTest, function (err, testResult) {
  console.log("GET RESULTS: ", arguments);

  // bump the expiration time for this key
  cache.client.expire("test", 60, function (err) {
    if (err) { console.log(err); }
  });
});


// use cachon to get or create the value

cache.existsOrCreate("test2", createTest, function (err, testResult) {
  console.log("EXISTS RESULTS: ", arguments);

  // bump the expiration time for this key
  cache.client.expire("test2", 60, function (err) {
    if (err) { console.log(err); }
  });
});
