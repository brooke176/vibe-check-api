const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: String,
    name: String,
    goOutIntents: [{
      date: { type: Date, default: Date.now },
      wantsToGoOut: { type: Boolean, default: false },
      friends: [{ type: String }] // Assuming friends are identified by their userId
    }]
  });   

const User = mongoose.model('User', userSchema);

module.exports = User;