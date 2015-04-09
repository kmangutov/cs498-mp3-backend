// Get the packages we need
var express = require('express');
var mongoose = require('mongoose');
var Llama = require('./models/llama');
var bodyParser = require('body-parser');
var router = express.Router();

//replace this with your Mongolab URL
var dbName = "admin";
var dbPass = "loladmin"; 
var dbUrl = "mongodb://" + dbName + ":" + dbPass + "@ds061681.mongolab.com:61681/varnishdb"
mongoose.connect(dbUrl);

// Create our Express application
var app = express();

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

//Allow CORS so that backend and frontend could pe put on different servers
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
  next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

//

var userController = require('./controllers/UserController.js');
var taskController = require('./controllers/TaskController.js');

//

// All our routes will start with /api
app.use('/api', router);

//Default route here
var homeRoute = router.route('/');

homeRoute.get(function(req, res) {
  res.json({ message: 'Hello World!' });
});

//Llama route 
var llamaRoute = router.route('/llamas');

llamaRoute.get(function(req, res) {
  res.json([{ "name": "alice", "height": 12 }, { "name": "jane", "height": 13 }]);
});

//

//var userRoute = router.route('/user');


router.get('/users', userController.getAll);
router.post('/users', userController.post);
router.options('/users', function(req, res){
  res.writeHead(200);
  res.end();
});

router.get('/users/:id', userController.getOne);
router.put('/users/:id', userController.putOne);
router.delete('/users/:id', userController.deleteOne);


router.get('/tasks', taskController.getAll);
router.post('/tasks', taskController.post);
router.options('/tasks', function(req, res){
  res.writeHead(200);
  res.end();
});

router.get('/tasks/:id', taskController.getOne);
router.put('/tasks/:id', taskController.putOne);
router.delete('/tasks/:id', taskController.deleteOne);

//userRoute.get(userController.)

//Add more routes here

// Start the server
app.listen(port);
console.log('Server running on port ' + port); 