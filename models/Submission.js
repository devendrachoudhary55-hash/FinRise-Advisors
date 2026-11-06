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
  createdAt:{ type: Date, default: Date.now },

  // ===== Daily lead triage (read/written by the leads API) =====
  // triage is set once a human or the daily task has judged the enquiry.
  //   null      — not yet looked at
  //   'genuine' — a real prospect worth a reply
  //   'spam'    — bot, test, or irrelevant; never contacted
  triage:     { type: String, enum: ['genuine', 'spam', null], default: null },
  triagedAt:  { type: Date, default: null },
  // Set true once a follow-up has been prepared for this lead, so the daily
  // task never queues the same person twice. A draft counts as handled —
  // whether it was actually sent is decided in Outlook, not here.
  nurtured:   { type: Boolean, default: false },
  nurturedAt: { type: Date, default: null },
  // Free-text note from the triage step (why it was judged spam, which blog
  // posts were chosen, etc.) so the decision is auditable later.
  triageNote: { type: String, default: '' }
});

// The daily feed queries on these two together; without an index it is a
// collection scan on every run.
submissionSchema.index({ nurtured: 1, createdAt: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
