import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { AppDispatch, RootState } from '../store';
import { fetchWeeklyStats, fetchMonthlyStats, clearStatsError } from '../store/userSlice';
import WaterBarChart from '../components/WaterBarChart';
import WaterLineChart from '../components/WaterLineChart';
import StatCard from '../components/StatCard';

type PeriodType = 'daily' | 'weekly' | 'monthly';

const StatsScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { weeklyStats, monthlyStats, isLoadingStats, statsError } = useSelector(
    (state: RootState) => state.user
  );

  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('weekly');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());

  useEffect(() => {
    const startDateStr = startDate.toISOString().split('T')[0];
    if (selectedPeriod === 'weekly') {
      dispatch(fetchWeeklyStats(startDateStr));
    } else if (selectedPeriod === 'monthly') {
      dispatch(fetchMonthlyStats(startDateStr));
    }
  }, [selectedPeriod, startDate, dispatch]);

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'set' && date) {
      setStartDate(date);
    }
    setShowDatePicker(false);
  };

  const getCurrentStats = () => {
    if (selectedPeriod === 'weekly') return weeklyStats;
    if (selectedPeriod === 'monthly') return monthlyStats;
    return weeklyStats;
  };

  const stats = getCurrentStats();

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'daily' && styles.activePeriodButton]}
        onPress={() => setSelectedPeriod('daily')}
      >
        <Text style={[styles.periodButtonText, selectedPeriod === 'daily' && styles.activePeriodText]}>
          Daily
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'weekly' && styles.activePeriodButton]}
        onPress={() => setSelectedPeriod('weekly')}
      >
        <Text style={[styles.periodButtonText, selectedPeriod === 'weekly' && styles.activePeriodText]}>
          Weekly
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.periodButton, selectedPeriod === 'monthly' && styles.activePeriodButton]}
        onPress={() => setSelectedPeriod('monthly')}
      >
        <Text style={[styles.periodButtonText, selectedPeriod === 'monthly' && styles.activePeriodText]}>
          Monthly
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderDatePicker = () => (
    <View style={styles.datePickerContainer}>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateButtonText}>
          From: {startDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );

  const renderDailyPlaceholder = () => (
    <View style={styles.placeholderContainer}>
      <Text style={styles.placeholderText}>Daily statistics coming soon...</Text>
    </View>
  );

  const renderStats = () => {
    if (selectedPeriod === 'daily') {
      return renderDailyPlaceholder();
    }

    if (isLoadingStats) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading statistics...</Text>
        </View>
      );
    }

    if (statsError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{statsError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(clearStatsError())}>
            <Text style={styles.retryButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!stats) {
      return (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>No statistics available</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.statsContainer} showsVerticalScrollIndicator={false}>
        <WaterBarChart data={stats.chartData} goal={stats.goal} />
        <WaterLineChart data={stats.chartData} />

        <View style={styles.statsCardsContainer}>
          <StatCard
            title="Total Water Intake"
            value={stats.summary.totalAmount}
            unit="ml"
            color="#2196F3"
          />
          <StatCard
            title="Average Daily Intake"
            value={stats.summary.avgDailyAmount}
            unit="ml"
            subtitle={`Goal: ${stats.goal}ml`}
            color="#00BCD4"
          />
          <StatCard
            title="Highest Daily Intake"
            value={stats.summary.maxAmount}
            unit="ml"
            color="#4CAF50"
          />
          <StatCard
            title="Lowest Daily Intake"
            value={stats.summary.minAmount}
            unit="ml"
            color="#FF9800"
          />
          <StatCard
            title="Days Goal Achieved"
            value={stats.summary.daysMetGoal}
            unit={`of ${stats.period.days} days`}
            subtitle={`${stats.summary.goalCompletionRate}% completion`}
            color="#9C27B0"
          />
          <StatCard
            title="Total Intakes"
            value={stats.summary.totalIntakes}
            unit="times"
            color="#F44336"
          />
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        {renderPeriodSelector()}
        {selectedPeriod !== 'daily' && renderDatePicker()}
      </View>
      {renderStats()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activePeriodButton: {
    backgroundColor: '#2196F3',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activePeriodText: {
    color: '#fff',
  },
  datePickerContainer: {
    marginTop: 12,
  },
  dateButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  statsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsCardsContainer: {
    paddingBottom: 16,
  },
});

export default StatsScreen;
