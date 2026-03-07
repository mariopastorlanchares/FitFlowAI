import { palette } from '@/constants/theme';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export default function WorkoutScreen() {
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>{t('dashboard.tabs.workout')} - Coming Soon</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: palette.textPrimary,
        fontFamily: 'Inter_600SemiBold',
        fontSize: 18,
    }
});
