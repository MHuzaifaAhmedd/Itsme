import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    // Read from environment at function call time (after dotenv has loaded)
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    const NODE_ENV = process.env.NODE_ENV || 'development';
    const isDevelopment = NODE_ENV === 'development';
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    
    if (isDevelopment) {
      console.log('🔗 Attempting to connect to MongoDB...');
      console.log('   URI:', MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    }

    const options = {
      // These options help prevent connection issues
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    await mongoose.connect(MONGODB_URI, options);
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.db?.databaseName}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error: any) {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';
    
    console.error('❌ Error connecting to MongoDB:', error);
    
    // Provide helpful error messages
    if (error?.code === 'ECONNREFUSED' || error?.message?.includes('ECONNREFUSED')) {
      console.error('\n💡 Troubleshooting Tips:');
      console.error('   1. Make sure MongoDB is installed and running');
      console.error('   2. Check if MongoDB service is started: Get-Service MongoDB (Windows)');
      console.error('   3. Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas');
      console.error('   4. See MONGODB_SETUP.md for detailed setup instructions\n');
      console.error('   Connection URI:', MONGODB_URI?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
      console.error('   ⚠️  If you set MONGODB_URI in .env but see localhost, check:');
      console.error('      - .env file is in the backend/ directory');
      console.error('      - No typos in variable name (should be MONGODB_URI)');
      console.error('      - No extra spaces around the = sign');
    } else if (error?.message?.includes('authentication') || error?.code === 8000 || error?.code === 'ENOTFOUND') {
      console.error('\n💡 MongoDB Atlas Connection Issues:');
      console.error('   1. Check your username and password in the connection string');
      console.error('   2. Verify Network Access is configured in Atlas (allow your IP or 0.0.0.0/0)');
      console.error('   3. Ensure Database User has correct permissions');
      console.error('   4. URL-encode special characters in password (e.g., @ → %40, # → %23)');
      console.error('   5. Check if the cluster is paused (M0 free tier pauses after inactivity)\n');
      console.error('   Connection URI:', MONGODB_URI?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
      console.error('   Error details:', error.message || error.toString());
    } else {
      console.error('\n💡 Connection Error Details:');
      console.error('   Error code:', error?.code);
      console.error('   Error message:', error?.message || error.toString());
      console.error('   Connection URI:', MONGODB_URI?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    }
    
    process.exit(1);
  }
};

export default connectDatabase;
