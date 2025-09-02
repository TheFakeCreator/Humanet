import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app.js';
import config from './config/index.js';

const app = createApp();

// Connect to MongoDB
mongoose.set('strictQuery', true);

async function connectDB() {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Gracefully shutting down...');
  await mongoose.connection.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

// Start server
async function startServer() {
  await connectDB();
  
  const PORT = config.PORT;
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
}

startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
