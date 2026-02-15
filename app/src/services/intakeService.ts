import apiClient from './api';
import { Intake, DailyIntakeResponse } from '../types';

export const IntakeService = {
  async getTodayIntakes(): Promise<DailyIntakeResponse> {
    const response = await apiClient.get<DailyIntakeResponse>('/intake/today');
    return response.data;
  },

  async getIntakeById(id: string): Promise<Intake> {
    const response = await apiClient.get<Intake>(`/intake/${id}`);
    return response.data;
  },

  async createIntake(amount: number): Promise<Intake> {
    const response = await apiClient.post<Intake>('/intake', { amount });
    return response.data;
  },

  async updateIntake(id: string, amount: number): Promise<Intake> {
    const response = await apiClient.put<Intake>(`/intake/${id}`, { amount });
    return response.data;
  },

  async deleteIntake(id: string): Promise<void> {
    await apiClient.delete(`/intake/${id}`);
  },

  async getIntakesByDate(date: string): Promise<DailyIntakeResponse> {
    const response = await apiClient.get<DailyIntakeResponse>(`/intake/date/${date}`);
    return response.data;
  },
};
