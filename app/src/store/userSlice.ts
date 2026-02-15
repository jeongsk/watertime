import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserService } from '../services/userService';
import { User, WeeklyStatsResponse, MonthlyStatsResponse } from '../types';

interface UserState {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
  weeklyStats: WeeklyStatsResponse | null;
  monthlyStats: MonthlyStatsResponse | null;
  isLoadingStats: boolean;
  statsError: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
  weeklyStats: null,
  monthlyStats: null,
  isLoadingStats: false,
  statsError: null,
};

// Async thunks
export const fetchProfile = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>('user/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const user = await UserService.getProfile();
    return user;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
  }
});

export const updateProfile = createAsyncThunk<
  User,
  { name?: string; goal?: number },
  { rejectValue: string }
>('user/updateProfile', async (updates, { rejectWithValue }) => {
  try {
    const user = await UserService.updateProfile(updates);
    return user;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
  }
});

export const fetchWeeklyStats = createAsyncThunk<
  WeeklyStatsResponse,
  string | undefined,
  { rejectValue: string }
>('user/fetchWeeklyStats', async (startDate, { rejectWithValue }) => {
  try {
    const stats = await UserService.getWeeklyStats(startDate);
    return stats;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch weekly stats');
  }
});

export const fetchMonthlyStats = createAsyncThunk<
  MonthlyStatsResponse,
  string | undefined,
  { rejectValue: string }
>('user/fetchMonthlyStats', async (startDate, { rejectWithValue }) => {
  try {
    const stats = await UserService.getMonthlyStats(startDate);
    return stats;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch monthly stats');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearStatsError: (state) => {
      state.statsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch profile';
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to update profile';
      })
      // Fetch Weekly Stats
      .addCase(fetchWeeklyStats.pending, (state) => {
        state.isLoadingStats = true;
        state.statsError = null;
      })
      .addCase(fetchWeeklyStats.fulfilled, (state, action) => {
        state.isLoadingStats = false;
        state.weeklyStats = action.payload;
      })
      .addCase(fetchWeeklyStats.rejected, (state, action) => {
        state.isLoadingStats = false;
        state.statsError = action.payload || 'Failed to fetch weekly stats';
      })
      // Fetch Monthly Stats
      .addCase(fetchMonthlyStats.pending, (state) => {
        state.isLoadingStats = true;
        state.statsError = null;
      })
      .addCase(fetchMonthlyStats.fulfilled, (state, action) => {
        state.isLoadingStats = false;
        state.monthlyStats = action.payload;
      })
      .addCase(fetchMonthlyStats.rejected, (state, action) => {
        state.isLoadingStats = false;
        state.statsError = action.payload || 'Failed to fetch monthly stats';
      });
  },
});

export const { clearError: clearUserError, clearStatsError } = userSlice.actions;
export default userSlice.reducer;
