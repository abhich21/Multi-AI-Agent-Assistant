const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', chatRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Multi-AI Agent Chatbot Backend',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      chat: 'POST /api/chat',
      pdf: 'POST /api/chat/pdf'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n╔════════════════════════════════════════════════╗');
  console.log('║   Multi-AI Agent Chatbot Backend Started         ║');
  console.log('╚════════════════════════════════════════════════╝\n');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('\n📍 Available Endpoints:');
  console.log(`   • POST http://localhost:${PORT}/api/chat`);
  console.log(`   • POST http://localhost:${PORT}/api/chat/pdf`);
  console.log('\n✨ Agents Ready:');
  console.log('   • Sales Agent');
  console.log('   • Report Agent');
  console.log('   • Summary Agent\n');
});

module.exports = app;
