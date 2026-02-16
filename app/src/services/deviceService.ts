import apiClient from './api';
import { DeviceInfo, DeviceRegisterResponse, DevicesListResponse } from '../types';
import { Platform } from 'react-native';

export const DeviceService = {
  /**
   * Register a device with the backend
   * Sends platform-specific token (fcmToken for Android, apnsToken for iOS)
   */
  async registerDevice(deviceId: string, pushToken: string, deviceInfo: DeviceInfo): Promise<DeviceRegisterResponse> {
    const platform = deviceInfo.platform || Platform.OS;
    const isIOS = platform === 'ios';

    const response = await apiClient.post<DeviceRegisterResponse>('/devices', {
      platform,
      fcmToken: isIOS ? undefined : pushToken,
      apnsToken: isIOS ? pushToken : undefined,
      deviceInfo: JSON.stringify({
        model: deviceInfo.model,
        osVersion: deviceInfo.osVersion,
        appVersion: deviceInfo.appVersion,
      }),
    });
    return response.data;
  },

  /**
   * Get all devices for the current user
   */
  async getDevices(): Promise<DevicesListResponse> {
    const response = await apiClient.get<DevicesListResponse>('/devices');
    return response.data;
  },

  /**
   * Remove a device by ID
   */
  async removeDevice(deviceId: string): Promise<void> {
    await apiClient.delete(`/devices/${deviceId}`);
  },
};
