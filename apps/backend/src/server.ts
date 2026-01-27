import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { env } from '@/config/env';
import { prisma } from '@/infrastructure/database/prisma';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

const start = async () => {
  try {
    // Check DB Connection
    await prisma.$connect();
    console.log('✅ Database connected');

    server.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
