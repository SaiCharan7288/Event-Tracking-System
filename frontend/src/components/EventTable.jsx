import { useState, useEffect, useCallback } from 'react';
import { fetchEvents, clearEvents } from '../services/api';
import { formatDistanceToNow, format } from 'date-fns';

const EventTable = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const loadEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { eventType: filter } : {};
      const data = await fetchEvents(params);
      setEvents(data.events || []);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadEvents();
    const interval = setInterval(loadEvents, 3000);
    return () => clearInterval(interval);
  }, [loadEvents]);

  const handleClear = async () => {
    if (window.confirm('Clear all events?')) {
      await clearEvents();
      loadEvents();
    }
  };

  const formatEventData = (event) => {
    switch (event.eventType) {
      case 'click':
        return `Clicked ${event.element?.tagName || 'element'} at (${event.coordinates?.x}, ${event.coordinates?.y})`;
      case 'scroll':
        return `Scrolled to ${event.scrollDepth}%`;
      case 'mousemove':
        return `Mouse at (${event.coordinates?.x}, ${event.coordinates?.y})`;
      case 'pageview':
        return 'Page viewed';
      default:
        return event.eventType;
    }
  };

  return (
    <div className="event-table-container">
      <div className="table-header">
        <h2>📊 Captured Events</h2>
        <div className="controls">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Events</option>
            <option value="click">Clicks</option>
            <option value="scroll">Scrolls</option>
            <option value="mousemove">Mouse Moves</option>
            <option value="pageview">Page Views</option>
          </select>
          <button onClick={loadEvents} className="refresh-btn">
            🔄 Refresh
          </button>
          <button onClick={handleClear} className="clear-btn">
            🗑️ Clear
          </button>
        </div>
      </div>

      {loading && !events.length ? (
        <div className="loading">Loading events...</div>
      ) : (
        <table className="events-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Event Data</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  📭 No events captured yet
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event._id}>
                  <td>{format(new Date(event.timestamp), 'HH:mm:ss')}</td>
                  <td>
                    <span className={`badge badge-${event.eventType}`}>
                      {event.eventType}
                    </span>
                  </td>
                  <td>{formatEventData(event)}</td>
                  <td>{formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventTable;  // ✅ THIS LINE MUST BE AT THE BOTTOM