import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Circle, Trash2, Bell } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSettingsStore } from '@/store/settings';

type HabitCardProps = {
  id: string;
  title: string;
  streak: number;
  completedToday: boolean;
  progress: number;
  reminder: string | null;
  onPress: () => void;
  onDelete: () => void;
};

export function HabitCard({
  title,
  streak,
  completedToday,
  progress,
  reminder,
  onPress,
  onDelete,
}: HabitCardProps) {
  const { theme } = useSettingsStore();

  return (
    <Animated.View entering={FadeIn.duration(400)}>
      <Pressable
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.card },
          pressed && [styles.cardPressed, { backgroundColor: theme.border }]
        ]}
        onPress={onPress}
      >
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <View style={styles.actions}>
              <View style={[
                styles.statusDot,
                { backgroundColor: completedToday ? theme.success : theme.border }
              ]} />
              <Pressable
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && styles.deleteButtonPressed,
                ]}
                onPress={onDelete}
              >
                <Trash2 size={20} color={theme.error} />
              </Pressable>
            </View>
          </View>
          
          {reminder && (
            <View style={styles.reminderContainer}>
              <Bell size={16} color={theme.primary} />
              <Text style={[styles.reminderText, { color: theme.secondaryText }]}>
                {reminder}
              </Text>
            </View>
          )}
          
          <View style={styles.stats}>
            <View style={styles.progressCircle}>
              <Circle
                size={44}
                color={theme.border}
                strokeWidth={4}
                absoluteStrokeWidth
              />
              <Circle
                size={44}
                color={theme.primary}
                strokeWidth={4}
                absoluteStrokeWidth
                style={styles.progressOverlay}
                strokeDasharray={[progress * 138, 138]}
              />
              <Text style={[styles.progressText, { color: theme.primary }]}>
                {Math.round(progress * 100)}%
              </Text>
            </View>
            
            <View style={styles.streakContainer}>
              <Text style={[styles.streakCount, { color: theme.text }]}>{streak}</Text>
              <Text style={[styles.streakLabel, { color: theme.secondaryText }]}>day streak</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonPressed: {
    opacity: 0.7,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  reminderText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressCircle: {
    position: 'relative',
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressOverlay: {
    position: 'absolute',
    transform: [{ rotateZ: '-90deg' }],
  },
  progressText: {
    position: 'absolute',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  streakContainer: {
    alignItems: 'flex-end',
  },
  streakCount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  streakLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});