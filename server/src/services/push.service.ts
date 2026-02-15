import admin from 'firebase-admin';

interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

interface DeviceToken {
  userId: string;
  token: string;
  platform: 'ios' | 'android';
}

export class PushNotificationService {
  private firebaseApp: admin.app.App | null = null;
  private isInitialized = false;

  /**
   * Initialize Firebase Admin SDK
   * Call this with your Firebase service account credentials
   */
  initializeFirebase(serviceAccountKey: any): void {
    try {
      if (this.isInitialized) {
        console.log('Firebase already initialized');
        return;
      }

      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccountKey)
      });

      this.isInitialized = true;
      console.log('Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('Firebase initialization error:', error);
      throw error;
    }
  }

  /**
   * Initialize Firebase from environment variables
   * Expects FIREBASE_SERVICE_ACCOUNT_KEY JSON string
   */
  initializeFromEnv(): void {
    const serviceAccountKeyStr = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountKeyStr) {
      console.warn('FIREBASE_SERVICE_ACCOUNT_KEY not found. Push notifications disabled.');
      return;
    }

    try {
      const serviceAccountKey = JSON.parse(serviceAccountKeyStr);
      this.initializeFirebase(serviceAccountKey);
    } catch (error) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', error);
    }
  }

  /**
   * Send push notification to a specific user
   * Note: You need to store device tokens for each user
   */
  async sendPushNotification(
    userId: string,
    payload: PushNotificationPayload
  ): Promise<boolean> {
    try {
      if (!this.isInitialized || !this.firebaseApp) {
        console.log('Firebase not initialized. Skipping push notification.');
        return false;
      }

      // In a real implementation, you would:
      // 1. Fetch device tokens for this user from a database
      // 2. Send the notification to each token
      // For now, this is a placeholder

      console.log(`Sending push notification to user ${userId}:`, payload);

      // Example of how to send with FCM (when you have device tokens):
      // const tokens = await this.getUserDeviceTokens(userId);
      // const message = {
      //   notification: {
      //     title: payload.title,
      //     body: payload.body
      //   },
      //   data: payload.data || {},
      //   tokens: tokens
      // };
      //
      // const response = await this.firebaseApp.messaging().sendMulticast(message);
      // console.log('FCM response:', response);

      return true;
    } catch (error) {
      console.error('Send push notification error:', error);
      return false;
    }
  }

  /**
   * Send push notification to specific device tokens
   */
  async sendToDeviceTokens(
    tokens: string[],
    payload: PushNotificationPayload
  ): Promise<{ success: number; failure: number }> {
    try {
      if (!this.isInitialized || !this.firebaseApp) {
        console.log('Firebase not initialized. Skipping push notification.');
        return { success: 0, failure: tokens.length };
      }

      const message = {
        notification: {
          title: payload.title,
          body: payload.body
        },
        data: payload.data || {},
        tokens: tokens
      };

      const response = await this.firebaseApp.messaging().sendEachForMulticast(message);

      console.log(`Push notification sent: ${response.successCount} success, ${response.failureCount} failed`);

      return {
        success: response.successCount,
        failure: response.failureCount
      };
    } catch (error) {
      console.error('Send to device tokens error:', error);
      return { success: 0, failure: tokens.length };
    }
  }

  /**
   * Send push notification to a single device token
   */
  async sendToSingleDevice(
    token: string,
    payload: PushNotificationPayload
  ): Promise<boolean> {
    try {
      if (!this.isInitialized || !this.firebaseApp) {
        console.log('Firebase not initialized. Skipping push notification.');
        return false;
      }

      const message = {
        notification: {
          title: payload.title,
          body: payload.body
        },
        data: payload.data || {},
        token: token
      };

      await this.firebaseApp.messaging().send(message);
      console.log('Push notification sent successfully to single device');
      return true;
    } catch (error) {
      console.error('Send to single device error:', error);
      return false;
    }
  }

  /**
   * Subscribe user to a topic
   */
  async subscribeToTopic(tokens: string[], topic: string): Promise<void> {
    try {
      if (!this.isInitialized || !this.firebaseApp) {
        console.log('Firebase not initialized. Skipping topic subscription.');
        return;
      }

      await this.firebaseApp.messaging().subscribeToTopic(tokens, topic);
      console.log(`Subscribed ${tokens.length} tokens to topic: ${topic}`);
    } catch (error) {
      console.error('Subscribe to topic error:', error);
    }
  }

  /**
   * Unsubscribe user from a topic
   */
  async unsubscribeFromTopic(tokens: string[], topic: string): Promise<void> {
    try {
      if (!this.isInitialized || !this.firebaseApp) {
        console.log('Firebase not initialized. Skipping topic unsubscription.');
        return;
      }

      await this.firebaseApp.messaging().unsubscribeFromTopic(tokens, topic);
      console.log(`Unsubscribed ${tokens.length} tokens from topic: ${topic}`);
    } catch (error) {
      console.error('Unsubscribe from topic error:', error);
    }
  }

  /**
   * Send notification to a topic
   */
  async sendToTopic(
    topic: string,
    payload: PushNotificationPayload
  ): Promise<boolean> {
    try {
      if (!this.isInitialized || !this.firebaseApp) {
        console.log('Firebase not initialized. Skipping push notification.');
        return false;
      }

      const message = {
        notification: {
          title: payload.title,
          body: payload.body
        },
        data: payload.data || {},
        topic: topic
      };

      await this.firebaseApp.messaging().send(message);
      console.log(`Push notification sent to topic: ${topic}`);
      return true;
    } catch (error) {
      console.error('Send to topic error:', error);
      return false;
    }
  }
}

export const pushNotificationService = new PushNotificationService();

// Initialize from environment on startup if available
pushNotificationService.initializeFromEnv();
