import { Request, Response } from 'express';
import { prisma } from '../config/database';

/**
 * @swagger
 * /api/devices:
 *   post:
 *     summary: Register a device for push notifications
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - platform
 *             properties:
 *               platform:
 *                 type: string
 *                 enum: [ios, android]
 *               fcmToken:
 *                 type: string
 *                 description: Firebase Cloud Messaging token (Android)
 *               apnsToken:
 *                 type: string
 *                 description: Apple Push Notification Service token (iOS)
 *               deviceInfo:
 *                 type: string
 *                 description: Additional device information (JSON string)
 *     responses:
 *       201:
 *         description: Device registered successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
export async function registerDevice(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { platform, fcmToken, apnsToken, deviceInfo } = req.body;

    // Validation
    if (!platform || !['ios', 'android'].includes(platform)) {
      res.status(400).json({ error: 'Invalid platform. Must be "ios" or "android"' });
      return;
    }

    if (platform === 'android' && !fcmToken) {
      res.status(400).json({ error: 'fcmToken is required for Android devices' });
      return;
    }

    if (platform === 'ios' && !apnsToken) {
      res.status(400).json({ error: 'apnsToken is required for iOS devices' });
      return;
    }

    // Check if device already exists
    const existingDevice = await prisma.device.findFirst({
      where: {
        userId,
        OR: [
          { fcmToken: fcmToken || null },
          { apnsToken: apnsToken || null }
        ]
      }
    });

    if (existingDevice) {
      // Update existing device
      const updatedDevice = await prisma.device.update({
        where: { id: existingDevice.id },
        data: {
          platform,
          fcmToken: fcmToken || null,
          apnsToken: apnsToken || null,
          deviceInfo: deviceInfo || null,
          lastUsedAt: new Date()
        }
      });

      res.status(200).json({
        message: 'Device updated successfully',
        device: updatedDevice
      });
      return;
    }

    // Create new device
    const device = await prisma.device.create({
      data: {
        userId,
        platform,
        fcmToken: fcmToken || null,
        apnsToken: apnsToken || null,
        deviceInfo: deviceInfo || null
      }
    });

    res.status(201).json({
      message: 'Device registered successfully',
      device
    });
  } catch (error) {
    console.error('Register device error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Get all devices for the current user
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Devices retrieved successfully
 *       401:
 *         description: Unauthorized
 */
export async function getUserDevices(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    const devices = await prisma.device.findMany({
      where: { userId },
      orderBy: { lastUsedAt: 'desc' }
    });

    // Mask tokens for security (show only first 8 and last 4 characters)
    const maskedDevices = devices.map(device => ({
      ...device,
      fcmToken: device.fcmToken ? maskToken(device.fcmToken) : null,
      apnsToken: device.apnsToken ? maskToken(device.apnsToken) : null,
    }));

    res.json({ devices: maskedDevices });
  } catch (error) {
    console.error('Get user devices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Mask a token for display purposes
 * Shows only first 8 and last 4 characters
 */
function maskToken(token: string): string {
  if (!token || token.length <= 12) {
    return '****';
  }
  return `${token.substring(0, 8)}...${token.substring(token.length - 4)}`;
}

/**
 * @swagger
 * /api/devices/{deviceId}:
 *   delete:
 *     summary: Remove a device
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Device removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Device not found
 */
export async function removeDevice(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { deviceId } = req.params;

    // Verify device belongs to user
    const device = await prisma.device.findUnique({
      where: { id: deviceId as string }
    });

    if (!device) {
      res.status(404).json({ error: 'Device not found' });
      return;
    }

    if (device.userId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await prisma.device.delete({
      where: { id: deviceId as string }
    });

    res.json({ message: 'Device removed successfully' });
  } catch (error) {
    console.error('Remove device error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get all device tokens for a user
 * This is an internal helper function, not exposed as a route
 */
export async function getUserDeviceTokens(userId: string): Promise<string[]> {
  try {
    const devices = await prisma.device.findMany({
      where: { userId },
      select: {
        fcmToken: true,
        apnsToken: true
      }
    });

    const tokens: string[] = [];

    devices.forEach(device => {
      if (device.fcmToken) tokens.push(device.fcmToken);
      if (device.apnsToken) tokens.push(device.apnsToken);
    });

    return tokens;
  } catch (error) {
    console.error('Get user device tokens error:', error);
    return [];
  }
}
