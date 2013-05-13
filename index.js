var Cachon =  function Cachon (client, options) {

  var error;

  client.on('error', function (err) {
    error = err;
  });

  function getOrCreate (key, recreate, cb, index) {
    var index = index || 0;
    if (error) { return cb(error); }
    if (client.ready) {
      client.get(key, function (err, val) {
        if (err) {
          return cb(err);
        }
        if (!val) {
          recreate(key, function (err) {
            if (err) { return cb(err); }
            getOrCreate(key, recreate, cb, index + 1);
          });
        } else {
          cb(null, val);
        }
      });
    } else {
      if (index < 2) {
        setTimeout(function () {
          getOrCreate(key, recreate, cb, index + 1);
        }, 200);
      } else {
        returnError('notready', cb);
      }
    }
  }

  function existsOrCreate (key, recreate, cb, index) {
    var index = index || 0;
    if (error) { return cb(error); }
    if (client.ready) {
      client.exists(key, function (err, val) {
        if (err) { return cb(err); }
        if (!val) {
          recreate(key, function (err) {
            if (err) { return cb(err); }
            existsOrCreate(key, recreate, cb, index + 1);
          });
        } else {
          cb(null, val);
        }
      });
    } else {
      if (index < 2) {
        setTimeout(function () {
          existsOrCreate(key, recreate, cb, index + 1);
        }, 200);
      } else {
        returnError('notready', cb);
      }
    }
  }

  function setWithExpiry (key, seconds, value, cb, index) {
    var index = index || 0;
    if (error) { return cb(error); }
    if (client.ready) {
      client.setex(key, seconds, value, cb);
    } else {
      if (index < 2) {
        setTimeout(function () {
          setWithExpiry(key, seconds, value, cb, index + 1);
        }, 200);
      } else {
        returnError('notready', cb);
      }
    }
  }

  var publicInterface =  {
    setWithExpiry: setWithExpiry,
    existsOrCreate: existsOrCreate,
    getOrCreate: getOrCreate,
    client: client
  };
  return publicInterface;
};

function returnError (stringId, cb) {
  var error;
  switch (stringId) {
    case "notready":
      error = new Error("Redis queue is not ready after retries.");
    break;
    default:
      error = new Error(stringId);
    break;
  }
  error.type = stringId;
  cb(error);
}


module.exports = Cachon;