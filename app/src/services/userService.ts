import apiClient from './api';
import { User, WeeklyStatsResponse, MonthlyStatsResponse } from '../types';

export const UserService = {
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>('/users/profile');
    return response.data;
  },

  async updateProfile(updates: { name?: string; goal?: number }): Promise<User> {
    const response = await apiClient.patch<User>('/users/profile', updates);
    return response.data;
  },

  async updateGoal(goal: number): Promise<User> {
    const response = await apiClient.patch<User>('/users/goal', { goal });
    return response.data;
  },

  async getWeeklyStats(startDate?: string): Promise<WeeklyStatsResponse> {
    const params = startDate ? { startDate } : {};
    const response = await apiClient.get<WeeklyStatsResponse>('/user/stats/weekly', { params });
    return response.data;
  },

  async getMonthlyStats(startDate?: string): Promise<MonthlyStatsResponse> {
    const params = startDate ? { startDate } : {};
    const response = await apiClient.get<MonthlyStatsResponse>('/user/stats/monthly', { params });
    return response.data;
  },
};
