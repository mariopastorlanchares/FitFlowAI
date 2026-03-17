import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HeaderLogo } from '../components/header-logo';
import { TodayWorkoutCard } from '../components/today-workout-card';
import { WeeklyStreak } from '../components/weekly-streak';
import { WorkoutContextSelector } from '../components/workout-context-selector';

export function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <HeaderLogo />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.flexLayout}>
          <WorkoutContextSelector />

          <View style={styles.cardContainer}>
            <TodayWorkoutCard />
          </View>

          <WeeklyStreak />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  flexLayout: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 16,
  },
  cardContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
});
