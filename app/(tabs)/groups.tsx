import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import {
  Users,
  Trophy,
  Search,
  Plus,
  TrendingUp,
  Target,
  Crown,
  Medal,
  UserPlus,
  ChevronRight,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSettingsStore } from '@/store/settings';

// Sample data
const groups = [
  {
    id: '1',
    name: 'Morning Routines',
    members: 128,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=200&fit=crop',
    description: 'Early birds supporting each other in building morning habits',
    activeChallenge: 'Rise and Shine Challenge',
    progress: 85,
  },
  {
    id: '2',
    name: 'Fitness Enthusiasts',
    members: 256,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop',
    description: 'Group focused on fitness and healthy lifestyle habits',
    activeChallenge: '30-Day Workout Challenge',
    progress: 65,
  },
  {
    id: '3',
    name: 'Mindfulness Masters',
    members: 94,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=200&fit=crop',
    description: 'Building meditation and mindfulness habits together',
    activeChallenge: 'Daily Meditation Sprint',
    progress: 92,
  },
];

const leaderboard = [
  {
    rank: 1,
    name: 'Sarah Johnson',
    points: 2850,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    streak: 45,
  },
  {
    rank: 2,
    name: 'Michael Chen',
    points: 2720,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    streak: 38,
  },
  {
    rank: 3,
    name: 'Emily Davis',
    points: 2680,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    streak: 42,
  },
];

const challenges = [
  {
    id: '1',
    title: 'Early Bird Challenge',
    participants: 234,
    daysLeft: 12,
    prize: '500 Points',
    icon: Crown,
  },
  {
    id: '2',
    title: 'Mindfulness Marathon',
    participants: 156,
    daysLeft: 18,
    prize: '300 Points',
    icon: Target,
  },
  {
    id: '3',
    title: 'Fitness February',
    participants: 412,
    daysLeft: 5,
    prize: '1000 Points',
    icon: Trophy,
  },
];

export default function GroupsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useSettingsStore();

  const renderGroupItem = ({ item }) => (
    <Pressable
      style={[styles.groupCard, { backgroundColor: theme.card }]}
      onPress={() => {}}
    >
      <Image source={{ uri: item.image }} style={styles.groupImage} />
      <View style={styles.groupContent}>
        <View style={styles.groupHeader}>
          <Text style={[styles.groupName, { color: theme.text }]}>{item.name}</Text>
          <View style={styles.membersContainer}>
            <Users size={16} color={theme.secondaryText} />
            <Text style={[styles.membersCount, { color: theme.secondaryText }]}>
              {item.members}
            </Text>
          </View>
        </View>
        <Text style={[styles.groupDescription, { color: theme.secondaryText }]}>
          {item.description}
        </Text>
        <View style={styles.challengeInfo}>
          <Trophy size={16} color={theme.primary} style={styles.challengeIcon} />
          <Text style={[styles.challengeName, { color: theme.text }]}>
            {item.activeChallenge}
          </Text>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.progressFill,
                { width: `${item.progress}%`, backgroundColor: theme.primary },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.secondaryText }]}>
            {item.progress}%
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Groups</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Connect and compete with others
          </Text>
        </View>

        <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
          <Search size={20} color={theme.secondaryText} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search groups..."
            placeholderTextColor={theme.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Pressable
            style={[styles.createButton, { backgroundColor: theme.primary }]}
            onPress={() => {}}
          >
            <Plus size={20} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Your Groups
            </Text>
            <Pressable style={styles.seeAllButton} onPress={() => {}}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>
                See All
              </Text>
              <ChevronRight size={16} color={theme.primary} />
            </Pressable>
          </View>

          <FlatList
            data={groups}
            renderItem={renderGroupItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.groupsList}
          />
        </View>

        <Animated.View
          entering={FadeInDown.delay(200)}
          style={[styles.leaderboardCard, { backgroundColor: theme.card }]}
        >
          <View style={styles.leaderboardHeader}>
            <View style={styles.leaderboardTitle}>
              <TrendingUp size={20} color={theme.primary} />
              <Text style={[styles.leaderboardTitleText, { color: theme.text }]}>
                Global Leaderboard
              </Text>
            </View>
            <Pressable style={styles.seeAllButton} onPress={() => {}}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>
                Full Rankings
              </Text>
              <ChevronRight size={16} color={theme.primary} />
            </Pressable>
          </View>

          {leaderboard.map((user, index) => (
            <View key={user.rank} style={styles.leaderboardItem}>
              <View style={styles.rankContainer}>
                {index === 0 && <Crown size={20} color="#FFD700" />}
                {index === 1 && <Crown size={20} color="#C0C0C0" />}
                {index === 2 && <Crown size={20} color="#CD7F32" />}
                {index > 2 && (
                  <Text style={[styles.rankText, { color: theme.text }]}>
                    {user.rank}
                  </Text>
                )}
              </View>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.text }]}>
                  {user.name}
                </Text>
                <Text style={[styles.userStats, { color: theme.secondaryText }]}>
                  {user.points} pts • {user.streak} day streak
                </Text>
              </View>
              <Medal size={20} color={theme.primary} />
            </View>
          ))}
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400)}
          style={styles.challengesSection}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Active Challenges
            </Text>
            <Pressable style={styles.seeAllButton} onPress={() => {}}>
              <Text style={[styles.seeAllText, { color: theme.primary }]}>
                See All
              </Text>
              <ChevronRight size={16} color={theme.primary} />
            </Pressable>
          </View>

          {challenges.map((challenge) => (
            <Pressable
              key={challenge.id}
              style={[styles.challengeCard, { backgroundColor: theme.card }]}
              onPress={() => {}}
            >
              <View style={[styles.challengeIcon, { backgroundColor: `${theme.primary}20` }]}>
                <challenge.icon size={24} color={theme.primary} />
              </View>
              <View style={styles.challengeContent}>
                <Text style={[styles.challengeTitle, { color: theme.text }]}>
                  {challenge.title}
                </Text>
                <Text style={[styles.challengeStats, { color: theme.secondaryText }]}>
                  {challenge.participants} participants • {challenge.daysLeft} days left
                </Text>
                <Text style={[styles.challengePrize, { color: theme.primary }]}>
                  Prize: {challenge.prize}
                </Text>
              </View>
              <Pressable
                style={[styles.joinButton, { backgroundColor: theme.primary + '20' }]}
                onPress={() => {}}
              >
                <UserPlus size={20} color={theme.primary} />
              </Pressable>
            </Pressable>
          ))}
        </Animated.View>
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
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 24,
    marginTop: 0,
    padding: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  groupsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  groupCard: {
    width: 300,
    borderRadius: 16,
    overflow: 'hidden',
  },
  groupImage: {
    width: '100%',
    height: 120,
  },
  groupContent: {
    padding: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  groupName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  membersCount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  groupDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  challengeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeIcon: {
    marginRight: 8,
  },
  challengeName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 8,
  },
  progressBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  leaderboardCard: {
    margin: 24,
    padding: 16,
    borderRadius: 16,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  leaderboardTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leaderboardTitleText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  userStats: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  challengesSection: {
    marginBottom: 24,
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
  },
  challengeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  challengeContent: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  challengeStats: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  challengePrize: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  joinButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});