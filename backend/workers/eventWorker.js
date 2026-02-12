import eventQueue from '../queue/eventQueue.js';
import Event from '../models/Event.js';

// Process events from the queue - ONLY CALL THIS ONCE!
eventQueue.process(async (job) => {
  const { eventData } = job.data;
  
  try {
    // Validate required fields
    if (!eventData.eventType || !eventData.pageUrl) {
      throw new Error('Missing required event fields');
    }

    // Create and save event
    const event = new Event({
      ...eventData,
      serverTimestamp: new Date(),
      processed: true,
      jobId: job.id
    });
    
    const savedEvent = await event.save();
    
    console.log(`✅ Event saved: ${savedEvent.eventType} - ${savedEvent._id}`);
    
    return { 
      success: true, 
      eventId: savedEvent._id 
    };
    
  } catch (error) {
    console.error('❌ Worker error:', error.message);
    throw error;
  }
});

// ✅ REMOVE THIS LINE IF IT EXISTS:
// eventQueue.process(5);  ← DELETE THIS! It's the duplicate

console.log('👷 Event worker started and waiting for jobs...');