import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDatabase from './config/database';
import projectsRouter from './routes/projects';
import contactRouter from './routes/contact';

// Load environment variables
dotenv.config();

// Set NODE_ENV if not already set
const NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_ENV = NODE_ENV;

const isDevelopment = NODE_ENV === 'development';
const isProduction = NODE_ENV === 'production';

// Debug: Verify environment variables are loaded (only in development)
if (isDevelopment && process.env.MONGODB_URI) {
  console.log('✅ MONGODB_URI loaded from .env');
  console.log('   URI:', process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
} else if (!process.env.MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI not found in environment variables');
  console.warn('   Make sure .env file exists in backend/ directory');
  console.warn('   Using default: mongodb://localhost:27017/portfolio');
}

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend server is running',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/projects', projectsRouter);
app.use('/api/contact', contactRouter);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use((err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack }), // Include stack trace only in development
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
      console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
      console.log(`💾 MongoDB connected`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
