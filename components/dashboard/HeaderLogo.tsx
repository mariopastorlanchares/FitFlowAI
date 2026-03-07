import { palette } from '@/constants/theme';
import { Image, StyleSheet, Text, View } from 'react-native';

export function HeaderLogo() {
    return (
        <View style={styles.container}>
            <Image
                source={require('@/assets/images/fitflow_logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>FitFlow AI</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        marginBottom: 8,
    },
    logo: {
        width: 32,
        height: 32,
        marginRight: 12,
    },
    title: {
        color: palette.textPrimary,
        fontFamily: 'Inter_700Bold',
        fontSize: 22,
        letterSpacing: 0.5,
    }
});
