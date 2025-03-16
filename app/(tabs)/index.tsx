import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { HabitCard } from '@/components/HabitCard';
import { Calendar } from '@/components/Calendar';
import { router } from 'expo-router';
import { subDays, isSameDay } from 'date-fns';
import { useSettingsStore } from '@/store/settings';
import { useHabits } from '@/store/habits';

// Daily quotes data
const motivationalQuotes = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    quote: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    quote: "The only limit to our realization of tomorrow will be our doubts of today.",
    author: "Franklin D. Roosevelt"
  },
  {
    quote: "Your habits will determine your future.",
    author: "Jack Canfield"
  },
  {
    quote: "Small daily improvements are the key to staggering long-term results.",
    author: "Unknown"
  },
  {
    quote: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    quote: "The secret of getting ahead is getting started.",
    author: "Mark Twain"
  },
  {
    quote: "Progress is not achieved by luck or accident, but by working on yourself daily.",
    author: "Epictetus"
  }
];

export default function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { theme } = useSettingsStore();
  const { habits, loadHabits, toggleHabit, deleteHabit } = useHabits();
  const [dailyQuote, setDailyQuote] = useState(motivationalQuotes[0]);

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    // Get today's date as a string
    const today = new Date().toDateString();
    
    // Use the date string to generate a consistent index for the day
    const quoteIndex = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % motivationalQuotes.length;
    
    setDailyQuote(motivationalQuotes[quoteIndex]);
  }, []);

  // Filter habits based on selected date
  const filteredHabits = useMemo(() => {
    return habits.map(habit => ({
      ...habit,
      completedToday: habit.completedDates.some(date => 
        isSameDay(new Date(date), selectedDate)
      ),
    }));
  }, [selectedDate, habits]);

  // Get all completed dates across all habits
  const completedDates = [...new Set(
    habits.flatMap(habit => habit.completedDates.map(date => new Date(date)))
  )].sort((a, b) => b.getTime() - a.getTime());

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.text }]}>Good morning!</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Track your daily progress
          </Text>
          <View style={[styles.quoteContainer, { backgroundColor: theme.card }]}>
            <Text style={[styles.quote, { color: theme.text }]}>"{dailyQuote.quote}"</Text>
            <Text style={[styles.quoteAuthor, { color: theme.secondaryText }]}>
              — {dailyQuote.author}
            </Text>
          </View>
        </View>

        <Calendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          completedDates={completedDates}
          habits={habits}
        />

        <View style={styles.habitsList}>
          <View style={styles.habitsHeader}>
            <Text style={[styles.habitsTitle, { color: theme.text }]}>
              Habits for {selectedDate.toLocaleDateString('en-US', { 
                month: 'short',
                day: 'numeric'
              })}
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                { backgroundColor: theme.primary },
                pressed && styles.addButtonPressed,
              ]}
              onPress={() => router.push('/add-habit')}
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add New</Text>
            </Pressable>
          </View>

          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              {...habit}
              onPress={() => toggleHabit(habit.id)}
              onDelete={() => deleteHabit(habit.id)}
            />
          ))}

          {filteredHabits.length === 0 && (
            <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
              <Text style={[styles.emptyStateText, { color: theme.text }]}>
                No habits yet
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: theme.secondaryText }]}>
                Add your first habit to start tracking
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  header: {
    padding: 24,
    paddingTop: 48,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
  },
  quoteContainer: {
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  quote: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
  },
  habitsList: {
    padding: 16,
  },
  habitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  habitsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  addButtonPressed: {
    opacity: 0.9,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});