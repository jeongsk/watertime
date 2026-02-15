/**
 * @format
 */

import { IntakeService } from '../src/services/intakeService';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}));

describe('IntakeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create intake service instance', () => {
    expect(IntakeService).toBeDefined();
    expect(IntakeService.createIntake).toBeInstanceOf(Function);
    expect(IntakeService.getTodayIntakes).toBeInstanceOf(Function);
    expect(IntakeService.updateIntake).toBeInstanceOf(Function);
    expect(IntakeService.deleteIntake).toBeInstanceOf(Function);
  });
});
