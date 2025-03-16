import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { parseISO, isBefore } from 'date-fns';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permissions for notifications
export async function requestNotificationPermissions() {
  if (Platform.OS === 'web') {
    if ('Notification' in window) {
      try {
        const permission = await window.Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        return false;
      }
    }
    return false;
  } else {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  }
}

// Schedule a notification
export async function scheduleNotification(habitId: string, title: string, reminderTime: string) {
  try {
    // Parse the reminder time (HH:mm format) into today's date
    const [hours, minutes] = reminderTime.split(':');
    const scheduledTime = new Date();
    scheduledTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0);

    // If the time has already passed today, schedule for tomorrow
    if (isBefore(scheduledTime, new Date())) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    if (Platform.OS === 'web') {
      // For web, use the native Notification API
      if ('Notification' in window && Notification.permission === 'granted') {
        // Store the scheduled time in localStorage
        localStorage.setItem(`notification_${habitId}`, scheduledTime.toISOString());
        
        // Check if we should trigger the notification now
        checkWebNotifications();
      }
    } else {
      // For mobile platforms, use expo-notifications
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Habit Reminder',
          body: `Time to ${title}!`,
          data: { habitId },
        },
        trigger: {
          hour: parseInt(hours, 10),
          minute: parseInt(minutes, 10),
          repeats: true,
        },
      });
    }
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}

// Cancel a notification
export async function cancelNotification(habitId: string) {
  if (Platform.OS === 'web') {
    localStorage.removeItem(`notification_${habitId}`);
  } else {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    const notification = notifications.find(n => n.content.data?.habitId === habitId);
    if (notification) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

// Function to check and trigger web notifications
export function checkWebNotifications() {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  // Get all notification keys from localStorage
  const keys = Object.keys(localStorage).filter(key => key.startsWith('notification_'));

  keys.forEach(key => {
    const scheduledTime = new Date(localStorage.getItem(key) || '');
    const now = new Date();

    // If it's time to show the notification
    if (scheduledTime && !isBefore(scheduledTime, now)) {
      const habitId = key.replace('notification_', '');
      new Notification('Habit Reminder', {
        body: 'Time to complete your habit!',
        icon: '/icon.png', // Make sure you have an icon
      });

      // Schedule next notification for tomorrow
      const nextScheduledTime = new Date(scheduledTime);
      nextScheduledTime.setDate(nextScheduledTime.getDate() + 1);
      localStorage.setItem(key, nextScheduledTime.toISOString());
    }
  });
}

// Start checking for web notifications
if (Platform.OS === 'web') {
  // Check for notifications every minute
  setInterval(checkWebNotifications, 60000);
  
  // Also check on page load
  checkWebNotifications();
}