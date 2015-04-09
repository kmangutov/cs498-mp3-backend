// Load required packages
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

// Define our beer schema
var UserSchema  = new Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  pendingTasks: [String],

  dateCreated: {
    type: Date,
    required: true,
    default: Date.now
  }
  
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);