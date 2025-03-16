import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Target } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSettingsStore } from '@/store/settings';
import { useHabits } from '@/store/habits';

const FREQUENCY_OPTIONS = ['Daily', 'Weekly', 'Monthly'];
const REMINDER_TIMES = [
  '06:00', '07:00', '08:00', '09:00', '12:00',
  '15:00', '18:00', '20:00', '21:00', '22:00'
];

export default function AddHabitScreen() {
  const { theme } = useSettingsStore();
  const { addHabit } = useHabits();
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [frequency, setFrequency] = useState('Daily');
  const [enableReminder, setEnableReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please enter a habit name');
      return;
    }

    if (!goal.trim()) {
      setError('Please enter a goal');
      return;
    }

    const newHabit = {
      id: Date.now().toString(),
      title: name.trim(),
      goal: goal.trim(),
      frequency,
      reminder: enableReminder ? reminderTime : null,
      streak: 0,
      completedToday: false,
      progress: 0,
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    addHabit(newHabit);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Add New Habit</Text>
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            { backgroundColor: theme.primary },
            pressed && styles.buttonPressed,
          ]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <Animated.View
            entering={FadeInDown}
            style={styles.errorContainer}
          >
            <Text style={styles.errorText}>{error}</Text>
          </Animated.View>
        )}

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Basic Information</Text>
          <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Habit Name"
              placeholderTextColor={theme.secondaryText}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Goal (e.g., Read for 30 minutes)"
              placeholderTextColor={theme.secondaryText}
              value={goal}
              onChangeText={setGoal}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Frequency</Text>
          <View style={[styles.frequencyContainer, { backgroundColor: theme.card }]}>
            {FREQUENCY_OPTIONS.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.frequencyOption,
                  { borderColor: theme.border },
                  frequency === option && { 
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                  },
                ]}
                onPress={() => setFrequency(option)}
              >
                <Text
                  style={[
                    styles.frequencyText,
                    { color: theme.text },
                    frequency === option && { color: '#fff' },
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.reminderHeader}>
            <View style={styles.reminderTitle}>
              <Clock size={20} color={theme.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Daily Reminder
              </Text>
            </View>
            <Switch
              value={enableReminder}
              onValueChange={setEnableReminder}
              trackColor={{ false: theme.border, true: `${theme.primary}80` }}
              thumbColor={enableReminder ? theme.primary : '#fff'}
            />
          </View>

          {enableReminder && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timesList}
            >
              {REMINDER_TIMES.map((time) => (
                <Pressable
                  key={time}
                  style={[
                    styles.timeOption,
                    { borderColor: theme.border },
                    reminderTime === time && {
                      backgroundColor: theme.primary,
                      borderColor: theme.primary,
                    },
                  ]}
                  onPress={() => setReminderTime(time)}
                >
                  <Text
                    style={[
                      styles.timeText,
                      { color: theme.text },
                      reminderTime === time && { color: '#fff' },
                    ]}
                  >
                    {time}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={[styles.infoCard, { backgroundColor: theme.card }]}>
          <Target size={20} color={theme.primary} />
          <Text style={[styles.infoText, { color: theme.secondaryText }]}>
            Start small and build up gradually. Consistency is key to forming lasting habits.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#fff',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  input: {
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  frequencyContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  frequencyOption: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  frequencyText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  reminderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timesList: {
    gap: 8,
  },
  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
});