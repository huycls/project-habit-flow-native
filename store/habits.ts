import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleNotification, cancelNotification } from '@/lib/notifications';

export interface Habit {
  id: string;
  title: string;
  goal: string;
  frequency: string;
  reminder: string | null;
  streak: number;
  completedToday: boolean;
  progress: number;
  completedDates: string[];
  createdAt: string;
}

interface HabitsState {
  habits: Habit[];
  addHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (id: string) => void;
  loadHabits: () => Promise<void>;
}

export const useHabits = create<HabitsState>((set, get) => ({
  habits: [],

  addHabit: async (habit) => {
    set((state) => {
      const newHabits = [...state.habits, habit];
      AsyncStorage.setItem('habits', JSON.stringify(newHabits));
      
      // Schedule notification if reminder is set
      if (habit.reminder) {
        scheduleNotification(habit.id, habit.title, habit.reminder);
      }
      
      return { habits: newHabits };
    });
  },

  deleteHabit: async (id) => {
    set((state) => {
      const habit = state.habits.find(h => h.id === id);
      const newHabits = state.habits.filter(h => h.id !== id);
      AsyncStorage.setItem('habits', JSON.stringify(newHabits));
      
      // Cancel notification if it exists
      if (habit?.reminder) {
        cancelNotification(id);
      }
      
      return { habits: newHabits };
    });
  },

  toggleHabit: (id) => {
    set((state) => {
      const newHabits = state.habits.map(habit => {
        if (habit.id === id) {
          const isCompleted = !habit.completedToday;
          const today = new Date().toISOString().split('T')[0];
          const completedDates = isCompleted 
            ? [...habit.completedDates, today]
            : habit.completedDates.filter(date => date !== today);

          return {
            ...habit,
            completedToday: isCompleted,
            completedDates,
            streak: isCompleted ? habit.streak + 1 : Math.max(0, habit.streak - 1),
            progress: isCompleted ? 1 : 0,
          };
        }
        return habit;
      });

      AsyncStorage.setItem('habits', JSON.stringify(newHabits));
      return { habits: newHabits };
    });
  },

  loadHabits: async () => {
    try {
      const stored = await AsyncStorage.getItem('habits');
      if (stored) {
        const habits = JSON.parse(stored);
        
        // Reschedule notifications for habits with reminders
        habits.forEach((habit: Habit) => {
          if (habit.reminder) {
            scheduleNotification(habit.id, habit.title, habit.reminder);
          }
        });
        
        set({ habits });
      }
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  },
}));