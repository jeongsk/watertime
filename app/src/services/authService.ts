import apiClient from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types';

export const AuthService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    const { user, token } = response.data;

    // Store token
    await AsyncStorage.setItem('token', token);

    return { user, token };
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    const { user, token } = response.data;

    // Store token
    await AsyncStorage.setItem('token', token);

    return { user, token };
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      await AsyncStorage.removeItem('token');
    }
  },
};
