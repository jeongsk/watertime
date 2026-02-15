import { prisma } from '../config/database';
import { pushNotificationService } from './push.service';

export interface NotificationSchedule {
  userId: string;
  enabled: boolean;
  startHour: number;
  endHour: number;
  intervalMinutes: number;
  reminderThreshold: number; // percentage of daily goal
}

export class NotificationService {
  /**
   * Check if user should receive a reminder notification
   * based on their current water intake progress
   */
  async checkAndSendReminder(userId: string): Promise<boolean> {
    try {
      // Get user settings and goal
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { goal: true, isActive: true }
      });

      if (!user || !user.isActive) {
        return false;
      }

      // Get today's intake
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const intakes = await prisma.intake.findMany({
        where: {
          userId,
          timestamp: {
            gte: today,
            lt: tomorrow
          }
        }
      });

      const totalAmount = intakes.reduce((sum, intake) => sum + intake.amount, 0);
      const percentage = (totalAmount / user.goal) * 100;

      // Check if notification should be sent (e.g., every 25% progress)
      const thresholds = [25, 50, 75];
      const shouldNotify = thresholds.some(
        threshold =>
          percentage >= threshold &&
          percentage < threshold + 5
      );

      if (shouldNotify && percentage < 100) {
        // Check if we already sent a notification for this threshold
        const recentNotification = await prisma.notification.findFirst({
          where: {
            userId,
            type: 'reminder',
            sentAt: {
              gte: today
            }
          },
          orderBy: {
            sentAt: 'desc'
          }
        });

        // Only send if no notification sent in the last hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (!recentNotification || recentNotification.sentAt < oneHourAgo) {
          await this.sendReminderNotification(userId, percentage, totalAmount, user.goal);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Check and send reminder error:', error);
      return false;
    }
  }

  /**
   * Send a reminder notification to user
   */
  async sendReminderNotification(
    userId: string,
    percentage: number,
    currentAmount: number,
    goal: number
  ): Promise<void> {
    const title = 'WaterTime Reminder';
    const message = `You've reached ${Math.floor(percentage)}% of your daily goal! Keep going! (${currentAmount}/${goal}ml)`;

    // Save to database
    await prisma.notification.create({
      data: {
        userId,
        type: 'reminder',
        title,
        message
      }
    });

    // Send push notification
    await pushNotificationService.sendPushNotification(userId, {
      title,
      body: message,
      data: {
        type: 'reminder',
        percentage: percentage.toString()
      }
    });
  }

  /**
   * Send an achievement notification
   */
  async sendAchievementNotification(userId: string, achievement: string): Promise<void> {
    const title = 'WaterTime Achievement';
    const message = `Congratulations! ${achievement}`;

    await prisma.notification.create({
      data: {
        userId,
        type: 'achievement',
        title,
        message
      }
    });

    await pushNotificationService.sendPushNotification(userId, {
      title,
      body: message,
      data: {
        type: 'achievement',
        achievement
      }
    });
  }

  /**
   * Send a tip notification
   */
  async sendTipNotification(userId: string, tip: string): Promise<void> {
    const title = 'WaterTime Tip';
    const message = tip;

    await prisma.notification.create({
      data: {
        userId,
        type: 'tip',
        title,
        message
      }
    });

    await pushNotificationService.sendPushNotification(userId, {
      title,
      body: message,
      data: {
        type: 'tip'
      }
    });
  }

  /**
   * Get user's notification history
   */
  async getUserNotifications(
    userId: string,
    limit: number = 20
  ): Promise<any[]> {
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { sentAt: 'desc' },
      take: limit
    });

    return notifications.map(notification => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      sentAt: notification.sentAt,
      readAt: notification.readAt,
      isRead: !!notification.readAt
    }));
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId
      },
      data: {
        readAt: new Date()
      }
    });
  }

  /**
   * Mark all notifications as read for user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await prisma.notification.updateMany({
      where: {
        userId,
        readAt: null
      },
      data: {
        readAt: new Date()
      }
    });
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return await prisma.notification.count({
      where: {
        userId,
        readAt: null
      }
    });
  }
}

export const notificationService = new NotificationService();
