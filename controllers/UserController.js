
var User = require('../models/User.js');

var makeMessage = function(string, obj) { 

  obj = typeof obj !== 'undefined' ? obj : {};

  var out =  {
    "message": string,
    "data": obj
  };

  console.log(JSON.stringify(out));

  return out;
}

exports.post = function(req, res) {

  JSON.stringify(req.body);

  var nameVal = req.body.name;
  var emailVal = req.body.email;

  var newUser = new User({
    name: nameVal,
    email: emailVal
  });

  if(nameVal === undefined)
    return res.status(400).json(makeMessage("Missing name!", req.body));
  if(emailVal === undefined)
    return res.status(400).json(makeMessage("Missing email!", req.body));

  newUser.save(function(err, data) {

    if(err) {

      var errResp = res.status(400);
      if(err.code == 11000) return errResp.json(makeMessage("Duplicate email exists!"));
      return errResp.json(makeMessage("Uknonwn Error: " + err.name + ": " + err.err, data));
    }

    res.status(201).json(makeMessage("OK", data));
  });
}

exports.putOne = function(req, res) {

  User.findById(req.params.id, function(err, user) {

    if(err) 
      return res.status(404).json(makeMessage("No such user!"));

    for(var key in req.body) {

      if(key !== "dateCreated")
        user[key] = req.body[key];
    }

    user.save(function(err) {

      if(err)
        return res.status(400).json(makeMessage("Cannot put!"));
      return res.status(200).json(makeMessage("OK", user));
    });
  });
}

exports.deleteOne = function(req, res) {

  User.remove({_id: req.params.id}, function(err, user) {

    if(err || user == 0)
      return res.status(404).json(makeMessage("User not found!"));

    return res.status(200).json(makeMessage("OK", user));
  });
}
 
exports.getOne = function(req, res) {

  var mId = req.params.id;

  console.log("UserController::getOne " + mId);

  User.findOne({_id: mId}, function(err, user){

    if(err || user === null) return res.status(404).json(makeMessage("User id not found!"));
    res.status(200).json(makeMessage("OK", user));
  });
}

exports.getAll = function(req, res) {

  console.log("req.query: " + JSON.stringify(req.query));

  var query = User;

  //where=
  if(req.query.where !== undefined)
    query = query.find(eval("(" + req.query.where + ")"));
  else
    query = query.find();

  //sort=
  if(req.query.sort !== undefined)
    query = query.sort(eval("(" + req.query.sort + ")"));

  //select=
  if(req.query.select !== undefined)
    query = query.select(eval("(" + req.query.select + ")"))

  //skip=
  if(req.query.skip !== undefined)
    query = query.skip(req.query.skip);

  //limit=
  if(req.query.limit !== undefined)
    query = query.limit(req.query.limit);

  //count=
  if(req.query.count !== undefined)
    if(req.query.count === "true") {

      return query.count(function(err, count) {

        if(err) return res.status(400).json(makeMessage("Error in query!", err));
        res.status(200).json(makeMessage("OK", count));
      });
    }



  query.exec(function(err, users){

    if(err) return res.status(400).json(makeMessage("Error in query!", err));
    res.status(200).json(makeMessage("OK", users));
  });
}