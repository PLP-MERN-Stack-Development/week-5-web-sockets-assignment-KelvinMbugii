// server.js - Main server file for Socket.io chat application

const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');


const { PORT, CLIENT_URL } = require('./config/env');
const initSocket = require('./socket');
const { getMessages, getUsers } = require('./controllers/chatController');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth')


// connect to mongodb
connectDB();


const app = express();
const server = http.createServer(app);


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// auth routes
app.use('/api', authRoutes);


// API routes
app.get('/api/messages', async(req, res) => {
  const Message = require('./models/message');
  const message = await Message.find().sort({timestamp: -1}).limit(100).lean();

  res.json(reverse());
});

app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

// Root route
app.get('/', (req, res) => {
  res.send('Socket.io Chat Server is running');
});

// Socket.io connection handler
const io = initSocket(server, CLIENT_URL)
  

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io }; 