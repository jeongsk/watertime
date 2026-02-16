import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import intakeRoutes from './routes/intake.routes';
import userRoutes from './routes/user.routes';
import notificationRoutes from './routes/notification.routes';
import deviceRoutes from './routes/device.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'WaterTime API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      intake: {
        create: 'POST /api/intake',
        daily: 'GET /api/intake/daily',
        history: 'GET /api/intake/history',
        delete: 'DELETE /api/intake/:id'
      },
      user: {
        profile: 'GET /api/user/profile',
        updateProfile: 'PUT /api/user/profile',
        updateGoal: 'PUT /api/user/goal',
        stats: 'GET /api/user/stats'
      },
      devices: {
        register: 'POST /api/devices',
        list: 'GET /api/devices',
        remove: 'DELETE /api/devices/:deviceId'
      },
      notifications: {
        list: 'GET /api/notifications',
        unread: 'GET /api/notifications/unread',
        markRead: 'PUT /api/notifications/:id/read',
        markAllRead: 'PUT /api/notifications/read-all',
        test: 'POST /api/notifications/test'
      }
    }
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/intake', intakeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/devices', deviceRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
