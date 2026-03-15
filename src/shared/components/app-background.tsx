import { palette } from '@shared/constants/theme';
import { StyleSheet, View } from 'react-native';

interface AppBackgroundProps {
    children: React.ReactNode;
}

/**
 * Full-screen solid background.
 * Wrap any screen or layout with this.
 */
export function AppBackground({ children }: AppBackgroundProps) {
    return (
        <View style={styles.container}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
    },
});
