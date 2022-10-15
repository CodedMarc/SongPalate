const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  token: String,
  spotify: Object,
  spotifyId: String,
  created_at: {type: Date, default: Date.now}
})
userSchema.plugin(findOrCreate);
module.exports = mongoose.model('User', userSchema);
