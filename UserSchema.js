const mongoose = require('mongoose');
const findOrCreate = require('mongoose-findorcreate')

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: String,
  token: String,
  refresh: String,
  profile: Object,
  spotifyId: String,
  created_at: {type: Date, default: Date.now}
})
userSchema.plugin(findOrCreate);
module.exports = mongoose.model('User', userSchema);
