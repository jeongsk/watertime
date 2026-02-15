import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IntakeSummary } from '../types';
import WaterTimeWidgetModule from '../native/WaterTimeWidgetModule';

/**
 * Widget Data Manager
 * Handles data synchronization between the app and widgets
 */
class WidgetDataManager {
  private readonly TOTAL_AMOUNT_KEY = '@water_total_amount';
  private readonly GOAL_KEY = '@water_goal';
  private readonly LAST_UPDATE_KEY = '@water_last_update';

  /**
   * Update widget data after water intake change
   */
  async updateWidgetData(summary: IntakeSummary): Promise<void> {
    try {
      // Store data locally
      await AsyncStorage.setItem(this.TOTAL_AMOUNT_KEY, String(summary.totalAmount));
      await AsyncStorage.setItem(this.GOAL_KEY, String(summary.goal));
      await AsyncStorage.setItem(this.LAST_UPDATE_KEY, String(Date.now()));

      // Platform-specific widget update
      if (Platform.OS === 'ios') {
        await this.updateIOSWidget(summary);
      } else if (Platform.OS === 'android') {
        await this.updateAndroidWidget(summary);
      }
    } catch (error) {
      console.error('Error updating widget data:', error);
    }
  }

  /**
   * Update iOS widget via native module
   */
  private async updateIOSWidget(summary: IntakeSummary): Promise<void> {
    try {
      if (WaterTimeWidgetModule) {
        await WaterTimeWidgetModule.updateWidget(summary.totalAmount, summary.goal);
      } else {
        console.warn('WaterTimeWidgetModule not available. Widget update skipped.');
      }
    } catch (error) {
      console.error('Error updating iOS widget:', error);
    }
  }

  /**
   * Update Android widget via native module
   */
  private async updateAndroidWidget(summary: IntakeSummary): Promise<void> {
    try {
      if (WaterTimeWidgetModule) {
        await WaterTimeWidgetModule.updateWidget(summary.totalAmount, summary.goal);
      } else {
        console.warn('WaterTimeWidgetModule not available. Widget update skipped.');
      }
    } catch (error) {
      console.error('Error updating Android widget:', error);
    }
  }

  /**
   * Get current widget data
   */
  async getWidgetData(): Promise<{ totalAmount: number; goal: number } | null> {
    try {
      const totalAmount = await AsyncStorage.getItem(this.TOTAL_AMOUNT_KEY);
      const goal = await AsyncStorage.getItem(this.GOAL_KEY);

      if (totalAmount && goal) {
        return {
          totalAmount: parseInt(totalAmount, 10),
          goal: parseInt(goal, 10),
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting widget data:', error);
      return null;
    }
  }

  /**
   * Clear widget data (e.g., on logout or new day)
   */
  async clearWidgetData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.TOTAL_AMOUNT_KEY,
        this.GOAL_KEY,
        this.LAST_UPDATE_KEY,
      ]);

      // Reset to zero for new day
      await AsyncStorage.setItem(this.TOTAL_AMOUNT_KEY, '0');

      // Clear native widget data
      if (WaterTimeWidgetModule) {
        await WaterTimeWidgetModule.clearWidgetData();
      }
    } catch (error) {
      console.error('Error clearing widget data:', error);
    }
  }

  /**
   * Check if data needs to be refreshed (new day)
   */
  async shouldRefreshData(): Promise<boolean> {
    try {
      const lastUpdate = await AsyncStorage.getItem(this.LAST_UPDATE_KEY);

      if (!lastUpdate) {
        return true;
      }

      const lastUpdateTime = parseInt(lastUpdate, 10);
      const now = Date.now();
      const hoursSinceUpdate = (now - lastUpdateTime) / (1000 * 60 * 60);

      // Refresh if more than 24 hours have passed
      return hoursSinceUpdate >= 24;
    } catch (error) {
      console.error('Error checking refresh needed:', error);
      return true;
    }
  }
}

export default new WidgetDataManager();
