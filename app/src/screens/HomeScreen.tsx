import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import { addIntake, fetchTodayIntakes } from '../store/intakeSlice';

const HomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { todayIntakes, summary, isLoading } = useSelector((state: RootState) => state.intake);

  const [amount, setAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    dispatch(fetchTodayIntakes());
  }, [dispatch]);

  const handleAddIntake = async () => {
    const intakeAmount = parseInt(amount, 10);
    if (!intakeAmount || intakeAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsAdding(true);
    try {
      await dispatch(addIntake({ amount: intakeAmount })).unwrap();
      setAmount('');
      Alert.alert('Success', 'Water intake recorded!');
    } catch {
      Alert.alert('Error', 'Failed to record intake');
    } finally {
      setIsAdding(false);
    }
  };

  const quickAddAmounts = [100, 250, 500];

  if (isLoading && !summary) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  const percentage = summary?.percentage || 0;
  const remaining = summary?.remaining || 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'User'}!</Text>
        <Text style={styles.subtitle}>Track your daily water intake</Text>
      </View>

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <Text style={styles.cardTitle}>Today's Progress</Text>
        <View style={styles.circleContainer}>
          <View style={styles.circle}>
            <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
            <Text style={styles.goalLabel}>{summary?.totalAmount || 0} / {summary?.goal || 2000}ml</Text>
          </View>
        </View>
        <Text style={styles.remainingText}>
          {remaining > 0 ? `${remaining}ml remaining` : 'Goal reached! 🎉'}
        </Text>
      </View>

      {/* Quick Add Section */}
      <View style={styles.quickAddCard}>
        <Text style={styles.cardTitle}>Quick Add</Text>
        <View style={styles.quickAddButtons}>
          {quickAddAmounts.map((quickAmount) => (
            <TouchableOpacity
              key={quickAmount}
              style={styles.quickAddButton}
              onPress={() => {
                setAmount(quickAmount.toString());
                handleAddIntake();
              }}
              disabled={isAdding}
            >
              <Text style={styles.quickAddButtonText}>+{quickAmount}ml</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Custom Amount */}
      <View style={styles.customAmountCard}>
        <Text style={styles.cardTitle}>Custom Amount</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter amount (ml)"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            editable={!isAdding}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddIntake}
            disabled={isAdding || !amount}
          >
            {isAdding ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.addButtonText}>Add</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Intakes */}
      <View style={styles.recentCard}>
        <Text style={styles.cardTitle}>Recent Intakes</Text>
        {todayIntakes.length === 0 ? (
          <Text style={styles.emptyText}>No intakes recorded today</Text>
        ) : (
          todayIntakes.slice(0, 5).map((intake) => (
            <View key={intake.id} style={styles.intakeItem}>
              <View style={styles.intakeInfo}>
                <Text style={styles.intakeAmount}>{intake.amount}ml</Text>
                <Text style={styles.intakeTime}>
                  {new Date(intake.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#2196F3',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#e3f2fd',
    marginTop: 5,
  },
  progressCard: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  circleContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 15,
    borderColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
  },
  percentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  goalLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  remainingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  quickAddCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickAddButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickAddButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  quickAddButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  customAmountCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  intakeItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  intakeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  intakeAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  intakeTime: {
    fontSize: 14,
    color: '#999',
  },
});

export default HomeScreen;
