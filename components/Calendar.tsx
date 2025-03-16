import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { format, addDays, isSameDay, isToday } from 'date-fns';
import { useSettingsStore } from '@/store/settings';

const { width } = Dimensions.get('window');
const DATE_CELL_WIDTH = 72;
const VISIBLE_DATES = Math.floor(width / DATE_CELL_WIDTH);
const TOTAL_DATES = 30;

type CalendarProps = {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  completedDates: Date[];
  habits: Array<{
    id: string;
    completedDates: Date[];
    progress: number;
  }>;
};

export function Calendar({ selectedDate, onSelectDate, completedDates, habits }: CalendarProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const today = new Date();
  const { theme } = useSettingsStore();
  
  const dates = Array.from({ length: TOTAL_DATES }, (_, i) => {
    const daysFromToday = i - Math.floor(TOTAL_DATES / 2);
    return addDays(today, daysFromToday);
  }).sort((a, b) => a.getTime() - b.getTime());

  const getDateProgress = (date: Date) => {
    const habitsForDate = habits.filter(habit => 
      habit.completedDates.some(d => isSameDay(d, date))
    );
    
    if (habitsForDate.length === 0) return 0;
    
    const totalProgress = habitsForDate.reduce((sum, habit) => sum + habit.progress, 0);
    return (totalProgress / habits.length) * 100;
  };

  const selectedDateProgress = getDateProgress(selectedDate);

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <Text style={[styles.monthText, { color: theme.text }]}>
          {format(selectedDate, 'MMMM yyyy')}
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={DATE_CELL_WIDTH}
        decelerationRate="fast"
        initialScrollOffset={Math.max(0, (TOTAL_DATES / 2 - VISIBLE_DATES / 2) * DATE_CELL_WIDTH)}
      >
        {dates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isTodayDate = isToday(date);
          const dateProgress = getDateProgress(date);
          
          return (
            <Pressable
              key={date.toISOString()}
              style={[
                styles.dateCell,
                { backgroundColor: theme.background },
                isSelected && { backgroundColor: theme.primary },
                isTodayDate && { backgroundColor: theme.primary + '20' },
              ]}
              onPress={() => onSelectDate(date)}
            >
              <Text style={[
                styles.dayName,
                { color: theme.secondaryText },
                isSelected && { color: '#fff' }
              ]}>
                {format(date, 'EEE')}
              </Text>
              <Text style={[
                styles.dayNumber,
                { color: theme.text },
                isSelected && { color: '#fff' }
              ]}>
                {format(date, 'd')}
              </Text>
              <View style={styles.progressIndicator}>
                <View style={[
                  styles.progressBackground,
                  { backgroundColor: isSelected ? 'rgba(255, 255, 255, 0.3)' : theme.border }
                ]}>
                  <View 
                    style={[
                      styles.progressBar,
                      { 
                        width: `${dateProgress}%`,
                        backgroundColor: isSelected ? '#fff' : theme.success
                      }
                    ]} 
                  />
                </View>
                <Text style={[
                  styles.progressText,
                  { color: isSelected ? '#fff' : theme.secondaryText }
                ]}>
                  {Math.round(dateProgress)}%
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.selectedDateProgress}>
        <Text style={[styles.selectedDateText, { color: theme.secondaryText }]}>
          Overall Progress for {format(selectedDate, 'MMM d')}
        </Text>
        <View style={[styles.selectedProgressBar, { backgroundColor: theme.border }]}>
          <View style={[
            styles.progressBarFull,
            { 
              width: `${selectedDateProgress}%`,
              backgroundColor: theme.primary
            }
          ]} />
        </View>
        <Text style={[styles.selectedProgressText, { color: theme.secondaryText }]}>
          {Math.round(selectedDateProgress)}% Complete
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  monthText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  dateCell: {
    width: DATE_CELL_WIDTH,
    height: 96,
    marginHorizontal: 4,
    borderRadius: 12,
    alignItems: 'center',
    padding: 8,
  },
  dayName: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  progressIndicator: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBackground: {
    width: '100%',
    height: 3,
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 1.5,
  },
  progressText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  selectedDateProgress: {
    marginTop: 16,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  selectedProgressBar: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFull: {
    height: '100%',
    borderRadius: 3,
  },
  selectedProgressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginTop: 8,
  },
});