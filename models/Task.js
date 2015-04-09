// Load required packages
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

// Define our beer schema
var TaskSchema  = new Schema({

  name: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  deadline: {
    type: Date,
    required: true
  },

  completed: {
    type: Boolean
  },

  assignedUser: {

    type: String,
    default: ""
  },

  assignedUserName: {

    type: String,
    default: "unassigned"
  },

  dateCreated: {
    type: Date,
    required: true,
    default: Date.now
  }
});

// Export the Mongoose model
module.exports = mongoose.model('Task', TaskSchema);