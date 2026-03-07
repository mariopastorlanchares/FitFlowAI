import { HeaderLogo } from '@/components/dashboard/HeaderLogo';
import { TodayWorkoutCard } from '@/components/dashboard/TodayWorkoutCard';
import { WeeklyStreak } from '@/components/dashboard/WeeklyStreak';
import { WorkoutContextSelector } from '@/components/dashboard/WorkoutContextSelector';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const { t } = useTranslation();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <HeaderLogo />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.flexLayout}>
                    {/* 2. Selector de Contexto */}
                    <WorkoutContextSelector />

                    {/* 3. Tarjeta Principal con CTA Inyectado */}
                    <View style={styles.cardContainer}>
                        <TodayWorkoutCard />
                    </View>

                    {/* 4. Resumen Racha debajo */}
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
        flexGrow: 1, // Permite que flexLayout distribuya el eje Y
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    flexLayout: {
        flex: 1, // Ocupa espacio remantente
        justifyContent: 'flex-start',
        gap: 16, // Espaciado natural
    },
    cardContainer: {
        alignItems: 'center',
        marginTop: 10,
    }
});
