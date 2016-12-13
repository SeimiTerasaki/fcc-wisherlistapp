var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var User = new Schema({
  username: String,
  avatar:{ type: String, default: 'https://i.imgsafe.org/b835e1677d.png' },
  email: { type: String, default: 'None' },
  password: { type: String, default: 'None' },
  boards:{ type : Array , default : [] }
});

module.exports = mongoose.model('user', User);