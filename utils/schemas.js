const mongoose = require('mongoose')
mongoose.connect(process.env.MONGODB_URI)

const OsuUserSchema = new mongoose.Schema({
  type: { type: String, default: 'user' },
  id: { type: String },
  discordID: { type: String },
  defaultMode: { type: String, default: 'osu' }
}, {
  timestamps: {},
  id: false
})

module.exports = {
  OsuUser: mongoose.model('OsuUser', OsuUserSchema)
}
