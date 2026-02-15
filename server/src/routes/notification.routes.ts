import { Router, Response } from 'express';
import { notificationService } from '../services/notification.service';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user's notification history
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of notifications to return
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, async (req, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const limit = parseInt(req.query.limit as string) || 20;
    const notifications = await notificationService.getUserNotifications(userId, limit);

    res.json({
      notifications,
      count: notifications.length
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/notifications/unread:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved
 *       401:
 *         description: Unauthorized
 */
router.get('/unread', authenticate, async (req, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const count = await notificationService.getUnreadCount(userId);

    res.json({
      unreadCount: count
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */
router.put('/:id/read', authenticate, async (req, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const { id } = req.params;
    await notificationService.markAsRead(id as string, userId);

    res.json({
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 */
router.put('/read-all', authenticate, async (req, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    await notificationService.markAllAsRead(userId);

    res.json({
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/notifications/test:
 *   post:
 *     summary: Send a test notification (for development)
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Test notification sent
 *       401:
 *         description: Unauthorized
 */
router.post('/test', authenticate, async (req, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    await notificationService.sendTipNotification(
      userId,
      'Drinking water helps boost your metabolism and energy levels!'
    );

    res.json({
      message: 'Test notification sent'
    });
  } catch (error) {
    console.error('Send test notification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
