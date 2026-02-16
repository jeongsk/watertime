/**
 * @format
 */

import authReducer, { logout } from '../src/store/authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });


  it('should handle logout', () => {
    const loggedInState = {
      ...initialState,
      user: {
        id: '1',
        email: 'test@test.com',
        name: 'Test User',
        goal: 2000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      token: 'test-token',
      isAuthenticated: true,
    };
    const state = authReducer(loggedInState, logout());
    expect(state).toEqual(initialState);
  });
});
