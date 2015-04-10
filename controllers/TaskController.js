
var Task = require('../models/Task.js');

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

  var newTask = new Task();//req.body;

  for(var key in req.body) {

    newTask[key] = req.body[key];
  }

  if(req.body.name === undefined)
    return res.status(400).json(makeMessage("Missing name!", req.body));
  if(req.body.deadline === undefined)
    return res.status(400).json(makeMessage("Missing deadline!", req.body));

  newTask.save(function(err, data) {

    if(err) {

      var errResp = res.status(400);
      return errResp.json(makeMessage("Uknonwn Error: " + err.name + ": " + err.err, data));
    }

    res.status(201).json(makeMessage("OK", data));
  });
}

exports.putOne = function(req, res) {

  Task.findById(req.params.id, function(err, task) {

    if(err) 
      return res.status(404).json(makeMessage("No such task!"));

    if(req.body.name === undefined)
      return res.status(400).json(makeMessage("Missing name!", req.body));
    if(req.body.deadline === undefined)
      return res.status(400).json(makeMessage("Missing deadline!", req.body));

    for(var key in req.body) {

      if(key !== "dateCreated")
        user[key] = req.body[key];
    }

    task.save(function(err) {

      if(err)
        return res.status(400).json(makeMessage("Cannot put!"));
      return res.status(200).json(makeMessage("OK", task));
    });
  });
}

exports.deleteOne = function(req, res) {

  Task.remove({_id: req.params.id}, function(err, task) {

    if(err || task == 0)
      return res.status(404).json(makeMessage("Task not found!"));

    return res.status(200).json(makeMessage("OK", task));
  });
}
 
exports.getOne = function(req, res) {

  var mId = req.params.id;

  console.log("TaskController::getOne " + mId);

  Task.findOne({_id: mId}, function(err, task){

    if(err || task === null) return res.status(404).json(makeMessage("Task id not found!"));
    res.status(200).json(makeMessage("OK", task));
  });
}

exports.getAll = function(req, res) {

  console.log("req.query: " + JSON.stringify(req.query));

  var query = Task;

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



  query.exec(function(err, tasks){

    if(err) return res.status(400).json(makeMessage("Error in query!", err));
    res.status(200).json(makeMessage("OK", tasks));
  });
}