import { app } from './app';
import { ENV } from './config/env';
import { prisma } from './config/db';

const server = app.listen(ENV.PORT, () => {
  console.log(`
  ======================================================
  🚀 Technoglobe PRO Management Backend Server Started
  📍 URL: http://localhost:${ENV.PORT}
  🛠️ API Base: http://localhost:${ENV.PORT}/api/v1
  📊 Environment: ${ENV.NODE_ENV}
  ======================================================
  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await prisma.$disconnect();
    console.log('HTTP server closed');
  });
});
