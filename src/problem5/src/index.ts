import app from './app';
import { initializeDatabase, closeDatabase } from './database/database';
import { config } from '../config';

const startServer = async (): Promise<void> => {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('Database initialized successfully');

    // Start server
    const server = app.listen(config.port, () => {
      const host = server.address();
      const hostname = typeof host === 'string' ? host : host?.address || 'localhost';
      const port = typeof host === 'object' ? host?.port : config.port;
      
      console.log(`Server running on port ${port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`Health check: http://${hostname}:${port}/health`);
      console.log(`Users API: http://${hostname}:${port}/api/users`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        console.log('HTTP server closed');
        
        try {
          await closeDatabase();
          console.log('Database connection closed');
          process.exit(0);
        } catch (error) {
          console.error('Error during database shutdown:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
