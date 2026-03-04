import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

interface AppBackgroundProps {
    children: React.ReactNode;
}

/**
 * Full-screen background with a dark concrete texture and a semi-transparent
 * overlay so content stays readable. Wrap any screen or layout with this.
 */
export function AppBackground({ children }: AppBackgroundProps) {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/bg-texture.png')}
                style={StyleSheet.absoluteFill}
                contentFit="cover"
            />
            {/* Dark overlay — adjust opacity here to make it lighter/darker */}
            <View style={styles.overlay} />
            <View style={styles.content}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0D0D0D',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(13, 13, 13, 0.72)',
    },
    content: {
        ...StyleSheet.absoluteFillObject,
    },
});
