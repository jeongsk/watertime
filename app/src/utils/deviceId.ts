import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const DEVICE_ID_KEY = '@watertime_device_id';

/**
 * Get or create a unique device ID
 * Uses UUID v4 for device identification
 */
export async function getDeviceId(): Promise<string> {
  try {
    // Try to get existing device ID
    const existingId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (existingId) {
      return existingId;
    }

    // Generate new device ID
    const newDeviceId = uuidv4();
    await AsyncStorage.setItem(DEVICE_ID_KEY, newDeviceId);
    return newDeviceId;
  } catch (error) {
    console.error('Failed to get/set device ID:', error);
    // Fallback to a random string if AsyncStorage fails
    return uuidv4();
  }
}

/**
 * Reset the stored device ID
 * Should only be called for testing purposes
 */
export async function resetDeviceId(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DEVICE_ID_KEY);
  } catch (error) {
    console.error('Failed to reset device ID:', error);
  }
}
