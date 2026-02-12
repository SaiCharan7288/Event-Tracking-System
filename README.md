Event Tracking System

A full-stack web application that captures browser events and processes them through an asynchronous queue system. Built for the Shopify App Developer Technical Assessment.

Overview

This single-page application listens to user interactions (clicks, scrolls, mouse movements, page views), sends events to a Redis queue, processes them with a background worker, stores them in MongoDB Atlas, and displays all captured events in a real-time table.

Tech Stack

Backend
- Node.js with Express
- MongoDB Atlas (Mongoose ODM)
- Redis with Bull Queue
- Background Worker Process

Frontend
- React 18 with Vite
- Axios for API calls
- date-fns for timestamp formatting
- Lodash for debouncing
- CSS3 for styling

Architecture

The application follows a strict queue-based architecture:

Browser Events → Redis Queue → Background Worker → MongoDB Atlas → React Table

Events never go directly to the database. Every event enters the queue first, gets processed by a worker, and is only then persisted to MongoDB.

Features

Event Capture
- Click tracking with coordinates and element details
- Scroll depth tracking at 25%, 50%, 75%, 100%
- Mouse movement tracking (throttled to 5 seconds)
- Page view tracking on component mount

Queue Processing
- Bull queue with Redis backend
- Automatic retry with exponential backoff (3 attempts)
- Job timeout handling (5 minutes)
- Queue monitoring and statistics

Background Worker
- Separate process independent from web server
- Concurrent job processing (5 jobs at once)
- Error handling with dead letter queue logging
- Graceful shutdown on process termination

Data Storage
- MongoDB Atlas cloud database
- Mongoose schema with validation
- Indexed queries for performance
- Server-side timestamp enrichment

User Interface
- Real-time table with 3-second auto-refresh
- Filter events by type (clicks, scrolls, mouse moves, page views)
- Clear all events with confirmation
- Responsive design for all screen sizes
- Clean, professional purple gradient theme





 
