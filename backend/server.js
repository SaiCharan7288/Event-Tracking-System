import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';

// 🔥 FORCE GOOGLE DNS TO FIX VI BLOCKING
dns.setServers(['8.8.8.8', '1.1.1.1']);

import connectDB from './config/db.js';
import eventRoutes from './routes/eventRoutes.js';
import './workers/eventWorker.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Event Tracking Backend is running...");
});

// API Routes
app.use('/api/events', eventRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});