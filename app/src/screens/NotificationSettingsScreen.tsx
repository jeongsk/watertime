import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { notificationService, NotificationSettings } from '../services/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationSettingsScreen = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    startHour: 8,
    endHour: 22,
    intervalMinutes: 120,
  });
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
    checkPermissions();
    initializeNotifications();
  }, []);

  const initializeNotifications = () => {
    try {
      notificationService.createChannel();
      notificationService.initialize();
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('notificationSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
        notificationService.updateSettings(parsed);
      } else {
        const currentSettings = notificationService.getSettings();
        setSettings(currentSettings);
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    }
  };

  const checkPermissions = async () => {
    try {
      const granted = await notificationService.checkPermissions();
      setPermissionsGranted(granted);
    } catch (error) {
      console.error('Failed to check permissions:', error);
    }
  };

  const requestPermissions = async () => {
    setLoading(true);
    try {
      const granted = await notificationService.requestPermissions();
      setPermissionsGranted(granted);

      if (granted) {
        Alert.alert(
          'Permissions Granted',
          'You will now receive water drinking reminders!'
        );
      } else {
        Alert.alert(
          'Permissions Denied',
          'Please enable notifications in your device settings to receive reminders.'
        );
      }
    } catch (error) {
      console.error('Failed to request permissions:', error);
      Alert.alert('Error', 'Failed to request notification permissions.');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      notificationService.updateSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
      Alert.alert('Error', 'Failed to save settings.');
    }
  };

  const toggleEnabled = async (value: boolean) => {
    if (value && !permissionsGranted) {
      Alert.alert(
        'Enable Notifications',
        'You need to grant notification permissions first.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Enable', onPress: requestPermissions },
        ]
      );
      return;
    }

    await saveSettings({ ...settings, enabled: value });
  };

  const adjustStartTime = async (increment: boolean) => {
    let newHour = settings.startHour + (increment ? 1 : -1);
    if (newHour < 0) newHour = 0;
    if (newHour > 23) newHour = 23;
    if (newHour >= settings.endHour) {
      Alert.alert('Invalid Time', 'Start time must be before end time.');
      return;
    }
    await saveSettings({ ...settings, startHour: newHour });
  };

  const adjustEndTime = async (increment: boolean) => {
    let newHour = settings.endHour + (increment ? 1 : -1);
    if (newHour < 0) newHour = 0;
    if (newHour > 23) newHour = 23;
    if (newHour <= settings.startHour) {
      Alert.alert('Invalid Time', 'End time must be after start time.');
      return;
    }
    await saveSettings({ ...settings, endHour: newHour });
  };

  const adjustInterval = async (increment: boolean) => {
    let newInterval = settings.intervalMinutes + (increment ? 30 : -30);
    if (newInterval < 30) newInterval = 30;
    if (newInterval > 240) newInterval = 240;
    await saveSettings({ ...settings, intervalMinutes: newInterval });
  };

  const sendTestNotification = () => {
    notificationService.sendNotification(
      'WaterTime Test',
      'This is a test notification!',
      { type: 'test' }
    );
    Alert.alert('Test Sent', 'You should receive a notification shortly.');
  };

  const formatTime = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const formatInterval = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notification Settings</Text>
      </View>

      <View style={styles.content}>
        {/* Permissions Section */}
        {!permissionsGranted && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Enable Notifications</Text>
            <Text style={styles.cardDescription}>
              Allow WaterTime to send you reminders to drink water throughout the day.
            </Text>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={requestPermissions}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Requesting...' : 'Grant Permissions'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Enable/Disable Switch */}
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.cardTitle}>Enable Reminders</Text>
              <Text style={styles.cardDescription}>
                Receive daily water drinking reminders
              </Text>
            </View>
            <Switch
              value={settings.enabled}
              onValueChange={toggleEnabled}
              disabled={!permissionsGranted}
              trackColor={{ false: '#ccc', true: '#2196F3' }}
              thumbColor={settings.enabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Time Range Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reminder Schedule</Text>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Start Time</Text>
            <View style={styles.timeControls}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => adjustStartTime(false)}
              >
                <Text style={styles.timeButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.timeValue}>{formatTime(settings.startHour)}</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => adjustStartTime(true)}
              >
                <Text style={styles.timeButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>End Time</Text>
            <View style={styles.timeControls}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => adjustEndTime(false)}
              >
                <Text style={styles.timeButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.timeValue}>{formatTime(settings.endHour)}</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => adjustEndTime(true)}
              >
                <Text style={styles.timeButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Interval</Text>
            <View style={styles.timeControls}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => adjustInterval(false)}
              >
                <Text style={styles.timeButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.timeValue}>{formatInterval(settings.intervalMinutes)}</Text>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => adjustInterval(true)}
              >
                <Text style={styles.timeButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Test Notification */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Test Notifications</Text>
          <Text style={styles.cardDescription}>
            Send a test notification to verify everything is working.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={sendTestNotification}
          >
            <Text style={styles.buttonText}>Send Test Notification</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About Notifications</Text>
          <Text style={styles.infoText}>
            • Reminders will be sent at regular intervals during the scheduled time range.
          </Text>
          <Text style={styles.infoText}>
            • You can customize the start time, end time, and interval between reminders.
          </Text>
          <Text style={styles.infoText}>
            • Make sure to allow notifications in your device settings.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2196F3',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchTextContainer: {
    flex: 1,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  timeControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeButton: {
    backgroundColor: '#2196F3',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    minWidth: 80,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#e3f2fd',
    padding: 20,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default NotificationSettingsScreen;
