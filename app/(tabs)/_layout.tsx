import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.common.primaryLighter,
        tabBarInactiveTintColor: Colors.text.ultraLight,
        tabBarActiveBackgroundColor: Colors.background.primary,
        tabBarItemStyle: {
          padding: 8,
          gap: 5,
        },
        tabBarStyle: {
          backgroundColor: Colors.background.primaryDark,
          borderTopColor: Colors.common.tint,
          height: 60,
        },
      }}
      initialRouteName="(workout)/index"
    >
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'stats-chart' : 'stats-chart-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(workout)"
        options={{
          title: 'Workout',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? 'barbell-sharp' : 'barbell-outline'}
              color={color}
              size={32}
              style={{ transform: [{ rotate: '-45deg' }] }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'calendar' : 'calendar-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
