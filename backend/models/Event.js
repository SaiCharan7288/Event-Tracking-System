import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: ['click', 'scroll', 'mousemove', 'keypress', 'pageview', 'custom']
  },
  pageUrl: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  coordinates: {
    x: Number,
    y: Number
  },
  scrollDepth: Number,
  element: {
    tagName: String,
    id: String,
    className: String,
    text: String
  },
  userAgent: String,
  screenSize: {
    width: Number,
    height: Number
  },
  clientTimestamp: Date,
  serverTimestamp: Date,
  ip: String,
  processed: {
    type: Boolean,
    default: true
  },
  jobId: String
}, {
  timestamps: true
});

// ✅ THIS IS CRITICAL - DEFAULT EXPORT
const Event = mongoose.model('Event', eventSchema);
export default Event;