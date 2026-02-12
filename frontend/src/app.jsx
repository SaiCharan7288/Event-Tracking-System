import { useState, useEffect } from 'react';
import EventTracker from './components/EventTracker';
import EventTable from './components/EventTable';
import { fetchStats } from './services/api';
import './app.css';
import './index.css';

function App() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };
    loadStats();
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎯 Event Tracking System</h1>
        <p className="subtitle">
          Events flow: Browser → Queue → Worker → Database
        </p>
        {stats && (
          <div className="stats-bar">
            <div className="stat">
              <span className="stat-label">📊 Total Events</span>
              <span className="stat-value">{stats.totalEvents || 0}</span>
            </div>
            <div className="stat">
              <span className="stat-label">⏳ Queue</span>
              <span className="stat-value">
                {stats.queue?.waiting || 0} waiting
              </span>
            </div>
          </div>
        )}
      </header>
      <main className="main-content">
        <EventTable />
      </main>
      <EventTracker />
    </div>
  );
}

export default app; // ⚠️ THIS LINE IS CRITICAL