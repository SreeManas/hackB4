import { createApp } from './app';
import { env } from './config/env';
import { logNotificationConfigStatus } from './config/notifications';
import { prisma } from './config/prisma';
import { logWebPushConfigStatus } from './config/webPush';

const app = createApp();

logNotificationConfigStatus();
logWebPushConfigStatus();

const server = app.listen(env.port, () => {
  console.log(`HACKB4 API listening on http://localhost:${env.port} (${env.nodeEnv})`);
});

const shutdown = (signal: string) => {
  console.log(`${signal} received, shutting down`);
  server.close(() => {
    void prisma.$disconnect().finally(() => process.exit(0));
  });
};
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
