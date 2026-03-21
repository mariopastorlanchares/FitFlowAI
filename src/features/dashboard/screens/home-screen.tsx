import { ScrollView, StyleSheet } from 'react-native';

import { HeaderLogo } from '../components/header-logo';
import { TodayWorkoutCard } from '../components/today-workout-card';
import { WeeklyStreak } from '../components/weekly-streak';
import { WorkoutContextSelector } from '../components/workout-context-selector';

export function HomeScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <HeaderLogo />
      <WorkoutContextSelector />
      <TodayWorkoutCard />
      <WeeklyStreak />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 16,
  },
});
