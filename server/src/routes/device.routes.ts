import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  registerDevice,
  getUserDevices,
  removeDevice
} from '../controllers/device.controller';

const router = Router();

// All device routes require authentication
router.use(authenticate);

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
router.post('/', registerDevice);

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
router.get('/', getUserDevices);

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
router.delete('/:deviceId', removeDevice);

export default router;
