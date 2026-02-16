import { Platform } from 'react-native';
import PushNotification, { Importance } from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceService } from './deviceService';
import { getDeviceId } from '../utils/deviceId';
import { DeviceInfo, PendingDeviceSync } from '../types';

export interface NotificationSettings {
  enabled: boolean;
  startHour: number;
  endHour: number;
  intervalMinutes: number;
}

class NotificationService {
  private isInitialized = false;
  private currentSettings: NotificationSettings = {
    enabled: true,
    startHour: 8,
    endHour: 22,
    intervalMinutes: 120
  };

  /**
   * Initialize push notifications
   * Must be called when app starts
   */
  initialize(): void {
    if (this.isInitialized) {
      return;
    }

    PushNotification.configure({
      // iOS settings
      onRegister: async (token) => {
        await this.handleTokenRegistration(token.token, token.os);
      },

      // Called when a remote notification is received or opened
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);

        // Process the notification
        if (notification.userInteraction) {
          // User tapped on notification
          console.log('Notification opened by user');
        }

        // Required for iOS
        if (Platform.OS === 'ios') {
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
      },

      // iOS permissions
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      popInitialNotification: true,

      /**
       * (optional) default: true
       * - Specified whether permissions (ios) and token (android and ios) will requested or not,
       * - if not, you must call PushNotificationsHandler.requestPermissions() later
       */
      requestPermissions: true,
    });

    this.isInitialized = true;
  }

  /**
   * Request notification permissions from user
   * Should be called after user consents in settings
   */
  async requestPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      PushNotification.requestPermissions().then(
        (permissions) => {
          const granted = permissions.alert && permissions.badge && permissions.sound;
          resolve(granted ?? false);
        },
        () => {
          resolve(false);
        }
      );
    });
  }

  /**
   * Check if notifications are enabled
   */
  async checkPermissions(): Promise<boolean> {
    return new Promise((resolve) => {
      PushNotification.checkPermissions((permissions) => {
        resolve(permissions.alert ?? false);
      });
    });
  }

  /**
   * Schedule a local notification
   */
  scheduleNotification(
    title: string,
    message: string,
    date: Date,
    data?: Record<string, any>
  ): void {
    PushNotification.localNotificationSchedule({
      title,
      message,
      date,
      userInfo: data,
      soundName: 'default',
      playSound: true,
      vibrate: true,
      vibration: 300,
    });
  }

  /**
   * Send an immediate local notification
   */
  sendNotification(
    title: string,
    message: string,
    data?: Record<string, any>
  ): void {
    PushNotification.localNotification({
      title,
      message,
      userInfo: data,
      soundName: 'default',
      playSound: true,
      vibrate: true,
      vibration: 300,
    });
  }

  /**
   * Schedule recurring water reminder notifications
   */
  scheduleReminders(settings: NotificationSettings): void {
    // Cancel existing reminders
    this.cancelReminders();

    if (!settings.enabled) {
      return;
    }

    this.currentSettings = settings;

    // Schedule notifications at specified intervals
    const { startHour, endHour, intervalMinutes } = settings;

    // Calculate number of reminders
    const totalMinutes = (endHour - startHour) * 60;
    const reminderCount = Math.floor(totalMinutes / intervalMinutes);

    for (let i = 0; i < reminderCount; i++) {
      const hour = startHour + Math.floor((i * intervalMinutes) / 60);
      const minute = (i * intervalMinutes) % 60;

      const date = new Date();
      date.setHours(hour, minute, 0, 0);

      // Only schedule if time is in the future
      if (date > new Date()) {
        this.scheduleNotification(
          'WaterTime Reminder',
          'Time to drink water! Stay hydrated!',
          date,
          { type: 'reminder' }
        );
      }
    }

    console.log(`Scheduled ${reminderCount} reminders from ${startHour}:00 to ${endHour}:00`);
  }

  /**
   * Cancel all scheduled reminders
   */
  cancelReminders(): void {
    PushNotification.cancelAllLocalNotifications();
  }

  /**
   * Update notification settings
   */
  updateSettings(settings: Partial<NotificationSettings>): void {
    const newSettings = { ...this.currentSettings, ...settings };
    this.scheduleReminders(newSettings);
  }

  /**
   * Get current notification settings
   */
  getSettings(): NotificationSettings {
    return { ...this.currentSettings };
  }

  /**
   * Create notification channel (Android only)
   * Must be called for Android O and above
   */
  createChannel(): void {
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'watertime-reminders',
          channelName: 'WaterTime Reminders',
          channelDescription: 'Notifications for water drinking reminders',
          playSound: true,
          soundName: 'default',
          importance: Importance.HIGH,
          vibrate: true,
        },
        (created) => {
          console.log(`Channel created ${created}`);
        }
      );
    }
  }

  /**
   * Get all scheduled notifications
   */
  getScheduledNotifications(): Promise<any[]> {
    return new Promise((resolve) => {
      PushNotification.getScheduledLocalNotifications((notifications) => {
        resolve(notifications);
      });
    });
  }

  /**
   * Cancel a specific notification by ID
   */
  cancelNotification(id: string): void {
    PushNotification.cancelLocalNotifications({ id: id.toString() });
  }

  /**
   * Set application badge number (iOS)
   */
  setBadgeNumber(number: number): void {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(number);
    }
  }

  /**
   * Get application badge number (iOS)
   */
  async getBadgeNumber(): Promise<number> {
    if (Platform.OS === 'ios') {
      return new Promise((resolve) => {
        PushNotificationIOS.getApplicationIconBadgeNumber((badge: number) => {
          resolve(badge);
        });
      });
    }
    return 0;
  }

  /**
   * Handle push token registration
   * If user is authenticated, register immediately
   * Otherwise queue for later sync
   */
  private async handleTokenRegistration(pushToken: string, os?: string): Promise<void> {
    try {
      const token = await AsyncStorage.getItem('token');
      const platform = (os || Platform.OS) as 'ios' | 'android';

      // Get device info
      const deviceId = await getDeviceId();
      const deviceInfo: DeviceInfo = {
        platform,
        model: Platform.OS === 'ios' ? 'iOS' : 'Android',
        osVersion: Platform.Version as string,
        appVersion: '1.0.0', // TODO: Get from app config
      };

      if (token) {
        // User is authenticated, register immediately
        await DeviceService.registerDevice(deviceId, pushToken, deviceInfo);
        console.log('Device registered successfully');
      } else {
        // User not authenticated, queue for later
        await this.queuePendingSync(pushToken, deviceInfo);
        console.log('Token queued for later registration');
      }
    } catch (error) {
      console.error('Failed to handle token registration:', error);
    }
  }

  /**
   * Queue a pending token registration for when user logs in
   */
  private async queuePendingSync(pushToken: string, deviceInfo: DeviceInfo): Promise<void> {
    try {
      const pendingSyncs: PendingDeviceSync[] = JSON.parse(
        await AsyncStorage.getItem('pending_device_syncs') || '[]'
      );

      // Add new pending sync
      pendingSyncs.push({
        token: pushToken,
        deviceInfo,
        timestamp: Date.now(),
      });

      await AsyncStorage.setItem('pending_device_syncs', JSON.stringify(pendingSyncs));
    } catch (error) {
      console.error('Failed to queue pending sync:', error);
    }
  }

  /**
   * Clear pending sync for a specific device
   */
  private async clearPendingSyncForDevice(pushToken: string): Promise<void> {
    try {
      const pendingSyncs: PendingDeviceSync[] = JSON.parse(
        await AsyncStorage.getItem('pending_device_syncs') || '[]'
      );

      const filtered = pendingSyncs.filter((sync) => sync.token !== pushToken);
      await AsyncStorage.setItem('pending_device_syncs', JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to clear pending sync:', error);
    }
  }

  /**
   * Sync all pending token registrations
   * Should be called after user logs in
   */
  async syncPendingTokenRegistrations(): Promise<void> {
    try {
      const pendingSyncs: PendingDeviceSync[] = JSON.parse(
        await AsyncStorage.getItem('pending_device_syncs') || '[]'
      );

      if (pendingSyncs.length === 0) {
        return;
      }

      console.log(`Syncing ${pendingSyncs.length} pending token registrations`);

      for (const sync of pendingSyncs) {
        try {
          const deviceId = await getDeviceId();
          await DeviceService.registerDevice(deviceId, sync.token, sync.deviceInfo);
          await this.clearPendingSyncForDevice(sync.token);
        } catch (error) {
          console.error('Failed to sync pending token:', error);
        }
      }
    } catch (error) {
      console.error('Failed to sync pending tokens:', error);
    }
  }

  /**
   * Deactivate current device
   * Should be called when user logs out
   */
  async deactivateCurrentDevice(): Promise<void> {
    try {
      const deviceId = await getDeviceId();
      await DeviceService.removeDevice(deviceId);
      console.log('Device deactivated');
    } catch (error) {
      console.error('Failed to deactivate device:', error);
    }
  }
}

export const notificationService = new NotificationService();
