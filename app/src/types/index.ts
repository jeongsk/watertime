// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  goal: number;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  goal?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Intake Types
export interface Intake {
  id: string;
  userId: string;
  amount: number;
  timestamp: string;
}

export interface CreateIntakeRequest {
  amount: number;
}

export interface UpdateIntakeRequest {
  amount: number;
}

export interface IntakeSummary {
  totalAmount: number;
  goal: number;
  percentage: number;
  remaining: number;
}

export interface DailyIntakeResponse {
  date: string;
  intakes: Intake[];
  summary: IntakeSummary;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Stats: undefined;
  Profile: undefined;
  NotificationSettings: undefined;
};

// Statistics Types
export interface DailyChartData {
  date: string;
  amount: number;
  count: number;
  goal: number;
  goalAchieved: boolean;
  percentage: number;
}

export interface WeeklyStatsResponse {
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
  goal: number;
  chartData: DailyChartData[];
  summary: {
    totalAmount: number;
    avgDailyAmount: number;
    maxAmount: number;
    minAmount: number;
    daysMetGoal: number;
    goalCompletionRate: number;
    totalIntakes: number;
  };
}

export interface MonthlyStatsResponse {
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
  goal: number;
  chartData: DailyChartData[];
  summary: {
    totalAmount: number;
    avgDailyAmount: number;
    maxAmount: number;
    minAmount: number;
    daysMetGoal: number;
    goalCompletionRate: number;
    totalIntakes: number;
  };
}

// Device Types
export interface DeviceInfo {
  platform: 'ios' | 'android';
  model: string;
  osVersion: string;
  appVersion: string;
}

export interface DeviceRegisterResponse {
  device: Device;
  tokenRegistered: boolean;
}

export interface Device {
  id: string;
  userId: string;
  deviceId: string;
  platform: 'ios' | 'android';
  pushToken?: string;
  isActive: boolean;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DevicesListResponse {
  devices: Device[];
}

export interface PendingDeviceSync {
  token: string;
  deviceInfo: DeviceInfo;
  timestamp: number;
}
