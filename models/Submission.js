const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  name:     { type: String, default: '' },
  email:    { type: String, default: '' },
  phone:    { type: String, default: '' },
  company:  { type: String, default: '' },
  service:  { type: String, default: '' },
  message:  { type: String, default: '' },
  resource: { type: String, default: '' },
  source:   { type: String, default: 'contact' }, // 'contact' or 'resource'
  read:     { type: Boolean, default: false },
  ipAddress:{ type: String, default: '' },
  createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);
