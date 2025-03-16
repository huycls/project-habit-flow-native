import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Image } from 'react-native';
import { 
  Bell, 
  ChevronRight, 
  CircleHelp as HelpCircle, 
  LogOut, 
  Moon, 
  Settings as SettingsIcon, 
  Star,
  User,
  Shield,
  Globe,
  Gift,
  MessageSquare,
  Share2,
  Smartphone,
} from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSettingsStore } from '@/store/settings';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';

type SettingsSectionProps = {
  title: string;
  children: React.ReactNode;
};

function SettingsSection({ title, children }: SettingsSectionProps) {
  const { theme } = useSettingsStore();
  
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.secondaryText }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: theme.card }]}>{children}</View>
    </View>
  );
}

type SettingsItemProps = {
  icon: React.ComponentType<any>;
  label: string;
  value?: string;
  color?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  badge?: string;
};

function SettingsItem({ 
  icon: Icon, 
  label, 
  value, 
  color, 
  onPress, 
  rightElement,
  badge 
}: SettingsItemProps) {
  const { theme } = useSettingsStore();
  
  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingsItem,
        { backgroundColor: theme.card },
        pressed && [styles.settingsItemPressed, { backgroundColor: theme.border }],
      ]}
      onPress={onPress}
    >
      <View style={[styles.settingsItemIcon, { backgroundColor: `${color}20` }]}>
        <Icon size={20} color={color || theme.primary} />
      </View>
      <View style={styles.settingsItemContent}>
        <Text style={[styles.settingsItemLabel, { color: theme.text }]}>{label}</Text>
        {value && <Text style={[styles.settingsItemValue, { color: theme.secondaryText }]}>{value}</Text>}
      </View>
      {badge && (
        <View style={[styles.badge, { backgroundColor: theme.primary + '20' }]}>
          <Text style={[styles.badgeText, { color: theme.primary }]}>{badge}</Text>
        </View>
      )}
      {rightElement || <ChevronRight size={20} color={theme.secondaryText} />}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { darkMode, theme, notifications, toggleDarkMode, updateNotificationSetting } = useSettingsStore();
  const { signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setUserProfile({
          ...user,
          ...profile,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <Text style={[styles.loadingText, { color: theme.secondaryText }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      showsVerticalScrollIndicator={false}
    >
      <Animated.View entering={FadeIn} style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      </Animated.View>

      <View style={[styles.profile, { borderBottomColor: theme.border }]}>
        <Image
          source={{ 
            uri: userProfile?.avatar_url || 
                 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=faces' 
          }}
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: theme.text }]}>
            {userProfile?.full_name || 'User'}
          </Text>
          <Text style={[styles.profileEmail, { color: theme.secondaryText }]}>
            {userProfile?.email}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.editProfileButton,
            { backgroundColor: theme.primary + '20' },
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push('/profile')}
        >
          <Text style={[styles.editProfileButtonText, { color: theme.primary }]}>
            Edit Profile
          </Text>
        </Pressable>
      </View>

      <SettingsSection title="Account">
        <SettingsItem
          icon={User}
          label="Personal Information"
          color="#10B981"
        />
        <SettingsItem
          icon={Shield}
          label="Privacy & Security"
          color="#6366F1"
        />
        <SettingsItem
          icon={Globe}
          label="Language"
          value="English"
          color="#8B5CF6"
        />
      </SettingsSection>

      <SettingsSection title="Preferences">
        <SettingsItem
          icon={Moon}
          label="Dark Mode"
          rightElement={
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ 
                false: theme.border, 
                true: theme.primary + '80' 
              }}
              thumbColor={darkMode ? theme.primary : '#fff'}
            />
          }
        />
        <SettingsItem
          icon={Bell}
          label="Notifications"
          rightElement={
            <Switch
              value={notifications.enabled}
              onValueChange={(value) => updateNotificationSetting('enabled', value)}
              trackColor={{ 
                false: theme.border, 
                true: theme.primary + '80' 
              }}
              thumbColor={notifications.enabled ? theme.primary : '#fff'}
            />
          }
        />
      </SettingsSection>

      {notifications.enabled && (
        <SettingsSection title="Notification Preferences">
          <SettingsItem
            icon={Bell}
            label="Daily Reminders"
            rightElement={
              <Switch
                value={notifications.dailyReminder}
                onValueChange={(value) => updateNotificationSetting('dailyReminder', value)}
                trackColor={{ 
                  false: theme.border, 
                  true: theme.primary + '80' 
                }}
                thumbColor={notifications.dailyReminder ? theme.primary : '#fff'}
              />
            }
          />
          <SettingsItem
            icon={Star}
            label="Achievement Alerts"
            rightElement={
              <Switch
                value={notifications.achievementAlerts}
                onValueChange={(value) => updateNotificationSetting('achievementAlerts', value)}
                trackColor={{ 
                  false: theme.border, 
                  true: theme.primary + '80' 
                }}
                thumbColor={notifications.achievementAlerts ? theme.primary : '#fff'}
              />
            }
          />
        </SettingsSection>
      )}

      <SettingsSection title="Features">
        <SettingsItem
          icon={Gift}
          label="Premium Features"
          color="#F59E0B"
          badge="PRO"
        />
        <SettingsItem
          icon={Share2}
          label="Share Progress"
          color="#EC4899"
        />
        <SettingsItem
          icon={Smartphone}
          label="Connected Devices"
          color="#10B981"
          value="2 devices"
        />
      </SettingsSection>

      <SettingsSection title="Support">
        <SettingsItem
          icon={HelpCircle}
          label="Help & Support"
          color="#F59E0B"
        />
        <SettingsItem
          icon={MessageSquare}
          label="Send Feedback"
          color="#8B5CF6"
        />
        <SettingsItem
          icon={SettingsIcon}
          label="Privacy Policy"
          color="#6366F1"
        />
      </SettingsSection>

      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          { backgroundColor: theme.error + '20' },
          pressed && styles.logoutButtonPressed,
        ]}
        onPress={handleLogout}
      >
        <LogOut size={20} color={theme.error} />
        <Text style={[styles.logoutButtonText, { color: theme.error }]}>
          Log Out
        </Text>
      </Pressable>

      <Text style={[styles.version, { color: theme.secondaryText }]}>
        Version 1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  header: {
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
  },
  profile: {
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingsItemPressed: {
    opacity: 0.7,
  },
  settingsItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingsItemContent: {
    flex: 1,
  },
  settingsItemLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  settingsItemValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 24,
    padding: 16,
    borderRadius: 12,
  },
  logoutButtonPressed: {
    opacity: 0.8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
  },
});