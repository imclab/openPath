
var mongo = require('mongodb');
var http = require('http');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('127.0.0.1', 27017, {auto_reconnect: true});
db = new Db('openpathdb', server, {safe: true});
//db = new Db('openpathdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'openpathdb' database");

        db.collection('users', function(err, collection){
            collection.findOne(function(err, item) {
                //if (!item){
                    populateDB();
                //}
            });
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving item: ' + id);
    db.collection('users', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('users', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addItem = function(req, res) {
    var item = req.body;
    console.log('Adding item: ' + JSON.stringify(item));
    db.collection('users', function(err, collection) {
        collection.insert(item, {safe:true}, function(err, result) {
            if (err) {
                res.send({'_id': "", 'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                //res.send(result[0]);
                res.send({'_id': result[0]._id, 'error': ""});
            }
        });
    });
};

exports.updateItem = function(req, res) {
    var id = req.params.id;
    var newItem = req.body;
    console.log('Updating item: ', id, 'with:',JSON.stringify(newItem));
    db.collection('users', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, newItem, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating item: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(newItem);
            }
        });
    });
};

exports.deleteItem = function(req, res) {
    var id = req.params.id;
    console.log('Deleting item: ' + id);
    db.collection('users', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};

/*------------------------------------------------------------------*/
// Custom functions

exports.addUser = function(email, callback) {
    var item = {"email": email, "createDate": new Date()}
    console.log('Adding GuestUser');
    db.collection('users', function(err, collection) {
        collection.insert(item, {safe:true}, function(err, result) {
            if (err) {
                returnValue = {'error':'An error has occurred'};
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                returnValue = result[0];
            }
            typeof callback == "function" && callback(returnValue);
        });
    });
};

exports.findByEmail = function(email, callback) {
	
    console.log('Retrieving by email: ' + email);
    db.collection('users', function(err, collection) {
        collection.findOne({'email': email}, function(err, item) {
            returnValue = item;
            typeof callback == "function" && callback(returnValue);
        });
    });
};

exports.updateItemData = function(req, res) {
    var col = req.params.collection;
    var id = req.params.id;
    var key = req.params.key;
    var val = req.params.value;
    console.log('Updating collection: ' + col + ', id: ' + id + ', field: ' + key + ' with value: ' + val);
    db.collection(col, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            item[key] = val;
            collection.update({'_id':new BSON.ObjectID(id)}, item, {safe:true}, function(err, result) {
                if (err) {
                    console.log('Error updating item: ' + err);
                    res.send({'error':'An error has occurred'});
                } else {
                    console.log('' + result + ' document(s) updated');
                    res.send(item);
                }
            });
        });
    });
}

/*------------------------------------------------------------------*/
// Populate database with sample data -- Only used once
var populateDB = function() {

    var users = [
	  {
	    "createDate": "2012-11-02 14:48:20",
	    "name": {
            "first":"francis",
            "last" : "drake"
        },
        "email" : "fan@moola.com"
	  },
	  {
	    "createDate": "2012-12-03 14:48:20",
	    "name": {
            "first":"goola",
            "last" : "moola"
        },
        "email" : "goola@moola.com"
	  },
	  {
	    "createDate": "2013-01-04 14:48:20",
        "name": {
            "first":"ahmad",
            "last" : "moola"
        },
        "email" : "ahmad@moola.com"
	  }
	];

    db.collection('users', function(err, collection) {
        collection.insert(users, {safe:true}, function(err, result) {});
    });

};
