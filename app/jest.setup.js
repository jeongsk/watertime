/* eslint-disable */
// Jest setup file for React Native

// Mock react-native-push-notification
jest.mock('react-native-push-notification', () => ({
  configure: jest.fn(),
  createChannel: jest.fn(),
  getApplicationIconBadgeNumber: jest.fn(),
  setApplicationIconBadgeNumber: jest.fn(),
  cancelAllLocalNotifications: jest.fn(),
  cancelLocalNotifications: jest.fn(),
  getScheduledLocalNotifications: jest.fn(),
  localNotification: jest.fn(),
  localNotificationSchedule: jest.fn(),
  requestPermissions: jest.fn(),
  abandonPermissions: jest.fn(),
  checkPermissions: jest.fn(),
  subscribe: jest.fn(),
  unregister: jest.fn(),
  notification: jest.fn(),
  Default: jest.fn(),
}));

// Mock @react-native-community/push-notification-ios
jest.mock('@react-native-community/push-notification-ios', () => ({
  addEventListener: jest.fn(),
  requestPermissions: jest.fn(),
  setApplicationIconBadgeNumber: jest.fn(),
  getApplicationIconBadgeNumber: jest.fn(),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    getAllKeys: jest.fn(),
    multiGet: jest.fn(),
    multiSet: jest.fn(),
    multiRemove: jest.fn(),
  },
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock react-native-screens
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

// Mock react-native navigation
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }) => children,
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    reset: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }) => children,
    Screen: ({ children }) => children,
  }),
}));

global.__createStoreId = () => {
  return 'test-store-id';
};

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234'),
}));
