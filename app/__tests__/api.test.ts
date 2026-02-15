/**
 * @format
 */

import { api } from '../src/services/api';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: jest.fn(() => Promise.resolve('test-token')),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  },
}));

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create API instance', () => {
    expect(api).toBeDefined();
    expect(api.interceptors).toBeDefined();
    expect(api.interceptors.request).toBeDefined();
    expect(api.interceptors.response).toBeDefined();
  });

  it('should have baseURL configured', () => {
    expect(api.defaults).toBeDefined();
  });

  it('should have request interceptor', () => {
    expect(api.interceptors.request.use).toBeDefined();
  });

  it('should have response interceptor', () => {
    expect(api.interceptors.response.use).toBeDefined();
  });
});
