import express from 'express';
import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';
import eventQueue from '../queue/eventQueue.js';

const router = express.Router();

/**
 * @route   POST /api/events
 * @desc    Queue an event for processing
 */
router.post('/', asyncHandler(async (req, res) => {
  const eventData = req.body;

  // Validate required fields
  if (!eventData.eventType || !eventData.pageUrl) {
    return res.status(400).json({ 
      success: false, 
      error: 'eventType and pageUrl are required' 
    });
  }

  // Add to queue
  const job = await eventQueue.add({
    eventData: {
      ...eventData,
      clientTimestamp: new Date().toISOString(),
      ip: req.ip || req.connection.remoteAddress
    }
  });

  res.status(202).json({
    success: true,
    message: 'Event queued for processing',
    jobId: job.id,
    queueSize: await eventQueue.count()
  });
}));

/**
 * @route   GET /api/events
 * @desc    Get all events from database
 */
router.get('/', asyncHandler(async (req, res) => {
  const { limit = 100, eventType, sort = 'desc' } = req.query;

  // Build query
  const query = eventType ? { eventType } : {};

  // Execute query
  const events = await Event.find(query)
    .sort({ timestamp: sort === 'desc' ? -1 : 1 })
    .limit(parseInt(limit))
    .lean();

  const total = await Event.countDocuments(query);

  res.json({
    success: true,
    count: events.length,
    total,
    events
  });
}));

/**
 * @route   GET /api/events/stats/summary
 * @desc    Get event and queue statistics
 */
router.get('/stats/summary', asyncHandler(async (req, res) => {
  // Get total events count
  const totalEvents = await Event.countDocuments();
  
  // Get event counts by type
  const eventsByType = await Event.aggregate([
    { $group: { _id: '$eventType', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Get queue statistics
  const queueStats = {
    waiting: await eventQueue.getWaitingCount(),
    active: await eventQueue.getActiveCount(),
    completed: await eventQueue.getCompletedCount(),
    failed: await eventQueue.getFailedCount(),
    delayed: await eventQueue.getDelayedCount()
  };

  res.json({
    success: true,
    totalEvents,
    eventsByType,
    queue: queueStats,
    timestamp: new Date().toISOString()
  });
}));

/**
 * @route   DELETE /api/events
 * @desc    Clear all events
 */
router.delete('/', asyncHandler(async (req, res) => {
  await Event.deleteMany({});
  await eventQueue.empty();
  
  res.json({
    success: true,
    message: 'All events cleared'
  });
}));

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete single event by ID
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  
  if (!event) {
    return res.status(404).json({
      success: false,
      error: 'Event not found'
    });
  }

  res.json({
    success: true,
    message: 'Event deleted',
    eventId: event._id
  });
}));

export default router;