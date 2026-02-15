/**
 * @format
 */

import authReducer, { login, logout, setLoading, setError } from '../src/store/authSlice';

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

  it('should handle setLoading', () => {
    const state = authReducer(initialState, setLoading(true));
    expect(state.isLoading).toBe(true);
  });

  it('should handle setError', () => {
    const errorMessage = 'Test error';
    const state = authReducer(initialState, setError(errorMessage));
    expect(state.error).toBe(errorMessage);
  });

  it('should handle logout', () => {
    const loggedInState = {
      ...initialState,
      user: { id: '1', email: 'test@test.com', name: 'Test User', goal: 2000 },
      token: 'test-token',
      isAuthenticated: true,
    };
    const state = authReducer(loggedInState, logout());
    expect(state).toEqual(initialState);
  });
});
