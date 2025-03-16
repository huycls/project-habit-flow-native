import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import {
  VictoryChart, VictoryLine, VictoryAxis, VictoryBar,
  VictoryTheme, VictoryLabel, VictoryPie
} from 'victory-native';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { Calendar, Medal, Target, Trophy, Award, Flame, Zap, Crown } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSettingsStore } from '@/store/settings';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - 48;

// Sample data
const generateDailyData = () => {
  const today = new Date();
  const days = eachDayOfInterval({
    start: subDays(today, 6),
    end: today,
  });

  return days.map(date => ({
    date,
    completion: Math.random() * 100,
    habits: Math.floor(Math.random() * 5) + 1,
  }));
};

const dailyData = generateDailyData();

const habitDistribution = [
  { x: "Morning", y: 35 },
  { x: "Afternoon", y: 25 },
  { x: "Evening", y: 40 },
];

const achievements = [
  {
    title: "7-Day Streak",
    description: "Complete all habits for 7 days straight",
    icon: Trophy,
    progress: 85,
    color: "#6366F1",
    points: 100,
    unlocked: true,
  },
  {
    title: "Early Bird",
    description: "Complete morning habits before 8 AM",
    icon: Calendar,
    progress: 60,
    color: "#F59E0B",
    points: 50,
    unlocked: true,
  },
  {
    title: "Goal Crusher",
    description: "Complete 100 habits total",
    icon: Target,
    progress: 75,
    color: "#10B981",
    points: 150,
    unlocked: false,
  },
  {
    title: "Perfect Week",
    description: "100% completion for an entire week",
    icon: Medal,
    progress: 40,
    color: "#8B5CF6",
    points: 200,
    unlocked: false,
  },
  {
    title: "Habit Master",
    description: "Maintain 5 habits consistently for a month",
    icon: Crown,
    progress: 30,
    color: "#EC4899",
    points: 300,
    unlocked: false,
  },
  {
    title: "Quick Start",
    description: "Complete a habit within an hour of waking up",
    icon: Zap,
    progress: 90,
    color: "#F59E0B",
    points: 50,
    unlocked: true,
  },
  {
    title: "Streak Master",
    description: "Maintain a 30-day streak",
    icon: Flame,
    progress: 20,
    color: "#EF4444",
    points: 500,
    unlocked: false,
  },
  {
    title: "Achievement Hunter",
    description: "Unlock 5 different achievements",
    icon: Award,
    progress: 45,
    color: "#14B8A6",
    points: 250,
    unlocked: false,
  },
];

const badges = [
  { name: "Novice", color: "#6B7280", points: 0 },
  { name: "Bronze", color: "#B45309", points: 500 },
  { name: "Silver", color: "#6B7280", points: 1000 },
  { name: "Gold", color: "#F59E0B", points: 2000 },
  { name: "Platinum", color: "#8B5CF6", points: 5000 },
  { name: "Diamond", color: "#2DD4BF", points: 10000 },
];

export default function StatsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const { theme } = useSettingsStore();
  const userPoints = 750; // This would come from your user state/context

  const currentBadge = badges.reduce((prev, curr) => {
    if (userPoints >= curr.points) return curr;
    return prev;
  }, badges[0]);

  const nextBadge = badges.find(badge => badge.points > userPoints) || badges[badges.length - 1];
  const pointsToNextBadge = nextBadge.points - userPoints;

  const periods = [
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Statistics</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          Track your progress and achievements
        </Text>
      </View>

      <Animated.View 
        entering={FadeInDown.delay(100)}
        style={[styles.badgeCard, { backgroundColor: theme.card }]}
      >
        <View style={styles.badgeHeader}>
          <View style={[styles.badgeIcon, { backgroundColor: currentBadge.color }]}>
            <Medal size={24} color="#fff" />
          </View>
          <View style={styles.badgeInfo}>
            <Text style={[styles.badgeTitle, { color: theme.text }]}>
              {currentBadge.name} Level
            </Text>
            <Text style={[styles.badgePoints, { color: theme.secondaryText }]}>
              {userPoints} Points
            </Text>
          </View>
        </View>
        {currentBadge !== badges[badges.length - 1] && (
          <View style={styles.nextBadgeInfo}>
            <Text style={[styles.nextBadgeText, { color: theme.secondaryText }]}>
              {pointsToNextBadge} points to {nextBadge.name}
            </Text>
            <View style={[styles.badgeProgress, { backgroundColor: theme.border }]}>
              <View 
                style={[
                  styles.badgeProgressFill,
                  { 
                    width: `${(userPoints / nextBadge.points) * 100}%`,
                    backgroundColor: nextBadge.color,
                  },
                ]} 
              />
            </View>
          </View>
        )}
      </Animated.View>

      <View style={[styles.periodSelector, { backgroundColor: theme.border }]}>
        {periods.map(period => (
          <Pressable
            key={period.value}
            style={[
              styles.periodButton,
              selectedPeriod === period.value && [
                styles.periodButtonActive,
                { backgroundColor: theme.card }
              ],
            ]}
            onPress={() => setSelectedPeriod(period.value as 'week' | 'month')}
          >
            <Text
              style={[
                styles.periodButtonText,
                { color: theme.secondaryText },
                selectedPeriod === period.value && { color: theme.text },
              ]}
            >
              {period.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <Animated.View 
        entering={FadeInDown.delay(200)} 
        style={[styles.chartCard, { backgroundColor: theme.card }]}
      >
        <Text style={[styles.chartTitle, { color: theme.text }]}>Completion Rate</Text>
        <VictoryChart
          width={CHART_WIDTH}
          height={220}
          theme={VictoryTheme.material}
          padding={{ top: 20, bottom: 40, left: 40, right: 20 }}
        >
          <VictoryAxis
            tickFormat={(date) => format(new Date(date), 'EEE')}
            style={{
              axis: { stroke: theme.border },
              tickLabels: { 
                fill: theme.secondaryText,
                fontSize: 12,
                fontFamily: 'Inter-Medium',
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => `${x}%`}
            style={{
              axis: { stroke: theme.border },
              tickLabels: { 
                fill: theme.secondaryText,
                fontSize: 12,
                fontFamily: 'Inter-Medium',
              },
            }}
          />
          <VictoryLine
            data={dailyData}
            x="date"
            y="completion"
            style={{
              data: { 
                stroke: theme.primary,
                strokeWidth: 3,
              },
            }}
          />
        </VictoryChart>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(300)} 
        style={[styles.chartCard, { backgroundColor: theme.card }]}
      >
        <Text style={[styles.chartTitle, { color: theme.text }]}>Daily Habits Completed</Text>
        <VictoryChart
          width={CHART_WIDTH}
          height={220}
          domainPadding={20}
          theme={VictoryTheme.material}
          padding={{ top: 20, bottom: 40, left: 40, right: 20 }}
        >
          <VictoryAxis
            tickFormat={(date) => format(new Date(date), 'EEE')}
            style={{
              axis: { stroke: theme.border },
              tickLabels: { 
                fill: theme.secondaryText,
                fontSize: 12,
                fontFamily: 'Inter-Medium',
              },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => Math.round(x)}
            style={{
              axis: { stroke: theme.border },
              tickLabels: { 
                fill: theme.secondaryText,
                fontSize: 12,
                fontFamily: 'Inter-Medium',
              },
            }}
          />
          <VictoryBar
            data={dailyData}
            x="date"
            y="habits"
            style={{
              data: {
                fill: theme.primary,
                width: 20,
              },
            }}
          />
        </VictoryChart>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(400)} 
        style={[styles.chartCard, { backgroundColor: theme.card }]}
      >
        <Text style={[styles.chartTitle, { color: theme.text }]}>Habit Distribution</Text>
        <View style={styles.pieChartContainer}>
          <VictoryPie
            data={habitDistribution}
            width={CHART_WIDTH}
            height={220}
            colorScale={[theme.primary, '#F59E0B', '#10B981']}
            innerRadius={70}
            labelRadius={({ innerRadius }) => (innerRadius as number) + 35}
            style={{
              labels: {
                fill: theme.text,
                fontSize: 12,
                fontFamily: 'Inter-Medium',
              },
            }}
          />
        </View>
      </Animated.View>

      <View style={styles.achievementsSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements</Text>
        <View style={styles.achievementsList}>
          {achievements.map((achievement, index) => (
            <Animated.View
              key={achievement.title}
              entering={FadeInDown.delay(500 + index * 100)}
              style={[
                styles.achievementCard,
                { backgroundColor: theme.card },
                !achievement.unlocked && { opacity: 0.7 },
              ]}
            >
              <View style={[styles.achievementIcon, { backgroundColor: `${achievement.color}20` }]}>
                <achievement.icon size={24} color={achievement.color} />
              </View>
              <View style={styles.achievementInfo}>
                <View style={styles.achievementHeader}>
                  <Text style={[styles.achievementTitle, { color: theme.text }]}>
                    {achievement.title}
                  </Text>
                  <Text style={[
                    styles.achievementPoints,
                    { color: achievement.unlocked ? theme.success : theme.secondaryText },
                  ]}>
                    {achievement.points} pts
                  </Text>
                </View>
                <Text style={[styles.achievementDescription, { color: theme.secondaryText }]}>
                  {achievement.description}
                </Text>
                <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${achievement.progress}%`,
                        backgroundColor: achievement.color,
                      },
                    ]} 
                  />
                </View>
                <Text style={[styles.progressText, { color: theme.secondaryText }]}>
                  {achievement.progress}% Complete
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  badgeCard: {
    margin: 24,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  badgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  badgePoints: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  nextBadgeInfo: {
    marginTop: 16,
  },
  nextBadgeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  badgeProgress: {
    height: 4,
    borderRadius: 2,
  },
  badgeProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 4,
    marginHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  periodButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  chartCard: {
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  pieChartContainer: {
    alignItems: 'center',
  },
  achievementsSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  achievementsList: {
    gap: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  achievementPoints: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});