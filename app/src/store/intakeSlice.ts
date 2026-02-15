import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IntakeService } from '../services/intakeService';
import { Intake, DailyIntakeResponse, IntakeSummary } from '../types';
import WidgetDataManager from '../utils/WidgetDataManager';

interface IntakeState {
  todayIntakes: Intake[];
  summary: IntakeSummary | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: IntakeState = {
  todayIntakes: [],
  summary: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchTodayIntakes = createAsyncThunk<
  DailyIntakeResponse,
  void,
  { rejectValue: string }
>('intake/fetchToday', async (_, { rejectWithValue }) => {
  try {
    const response = await IntakeService.getTodayIntakes();
    return response;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch intakes');
  }
});

export const addIntake = createAsyncThunk<
  Intake,
  { amount: number },
  { rejectValue: string }
>('intake/add', async ({ amount }, { rejectWithValue }) => {
  try {
    const intake = await IntakeService.createIntake(amount);
    return intake;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add intake');
  }
});

export const updateIntake = createAsyncThunk<
  Intake,
  { id: string; amount: number },
  { rejectValue: string }
>('intake/update', async ({ id, amount }, { rejectWithValue }) => {
  try {
    const intake = await IntakeService.updateIntake(id, amount);
    return intake;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update intake');
  }
});

export const deleteIntake = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('intake/delete', async (id, { rejectWithValue }) => {
  try {
    await IntakeService.deleteIntake(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete intake');
  }
});

const intakeSlice = createSlice({
  name: 'intake',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Today's Intakes
      .addCase(fetchTodayIntakes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodayIntakes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayIntakes = action.payload.intakes;
        state.summary = action.payload.summary;
        // Update widget with latest data
        if (action.payload.summary) {
          WidgetDataManager.updateWidgetData(action.payload.summary);
        }
      })
      .addCase(fetchTodayIntakes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch intakes';
      })
      // Add Intake
      .addCase(addIntake.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addIntake.fulfilled, (state, action) => {
        state.isLoading = false;
        state.todayIntakes.push(action.payload);
        // Update widget after adding intake
        if (state.summary) {
          const updatedSummary = {
            ...state.summary,
            totalAmount: state.summary.totalAmount + action.payload.amount,
            percentage: Math.round(((state.summary.totalAmount + action.payload.amount) / state.summary.goal) * 100),
            remaining: Math.max(0, state.summary.goal - (state.summary.totalAmount + action.payload.amount))
          };
          WidgetDataManager.updateWidgetData(updatedSummary);
        }
      })
      .addCase(addIntake.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to add intake';
      })
      // Update Intake
      .addCase(updateIntake.fulfilled, (state, action) => {
        const index = state.todayIntakes.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.todayIntakes[index] = action.payload;
        }
      })
      // Delete Intake
      .addCase(deleteIntake.fulfilled, (state, action) => {
        state.todayIntakes = state.todayIntakes.filter((i) => i.id !== action.payload);
      });
  },
});

export const { clearError: clearIntakeError } = intakeSlice.actions;
export default intakeSlice.reducer;
